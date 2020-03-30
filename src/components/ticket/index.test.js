const { tickets, createTicket, updateTicket } = require('./index');
const ticketRepo = require('./ticket-repository');
const ResourceNotFound = require('./errors/resource-not-found-error');
const PermissionError = require('./errors/permission-error');

jest.mock('./ticket-repository');

const dataSources = {
  ticketLoader: { load: jest.fn() },
  ticketRepo,
};

beforeEach(function () {
  jest.resetAllMocks();
});

describe('tickets', function () {
  test('Should get tickets by event id', async function () {
    dataSources.ticketLoader.load.mockResolvedValue('tickets');
    await expect(tickets(null, { eventId: 'eventId' }, { dataSources })).resolves.toBe('tickets');
    expect(dataSources.ticketLoader.load).toBeCalledWith('eventId');
  });
});

describe('create ticket', function () {
  let input;
  let user;

  beforeEach(function () {
    input = { event: {} };
    user = {};
  });

  test('Should create and return ticket', async function () {
    ticketRepo.create.mockResolvedValue('ticketCreated');
    await shouldReturn('ticketCreated');
  });

  test('Should add initial status', async function () {
    await shouldBeCalledWithContains(ticketRepo.create, { status: 'WAITING' });
  });

  async function shouldBeCalledWithContains(fakeObject, expectedContains) {
    await createTicket(null, { input, user }, { dataSources, user });
    expect(fakeObject).toBeCalledWith(expect.objectContaining(expectedContains));
  }

  test('Convert event.id to eventId', async function () {
    givenInputContains({
      event: { id: 'eventId' },
    });
    await shouldBeCalledWithContains(ticketRepo.create, { eventId: 'eventId' });
  });

  test('Should add user id from auth', async function () {
    givenUser({ id: 'userId' });
    await shouldBeCalledWithContains(ticketRepo.create, { postedBy: { id: 'userId' } });
  });

  function givenUser(authedUser) {
    user = authedUser;
  }

  function givenInputContains(ticketInput) {
    input = { ...input, ...ticketInput };
  }

  async function shouldReturn(expected) {
    await expect(createTicket(null, { input: input }, { dataSources, user })).resolves.toBe(expected);
  }
});

describe('updateTicket', function () {
  let input;
  let user;

  beforeEach(function () {
    input = { event: {} };
    user = { id: 'userId' };
  });

  test('Should update the ticket', async function () {
    ticketRepo.find.mockResolvedValue({ postedBy: { id: 'userId' } });
    ticketRepo.findAndUpdate.mockResolvedValue('ticketUpdated');
    await expect(updateTicket(null, { input }, { dataSources, user })).resolves.toBe('ticketUpdated');
  });

  test('Should throw error if ticket not found', async function () {
    ticketRepo.find.mockResolvedValue(null);
    await expect(updateTicket(null, { input }, { dataSources, user })).rejects.toThrowError('Ticket not found');
    await expect(updateTicket(null, { input }, { dataSources, user })).rejects.toThrow(ResourceNotFound);
  });

  test('Should throw error if user no permission', async function () {
    ticketRepo.find.mockResolvedValue({ postedBy: { id: 'wrongUserId' } });
    await expect(updateTicket(null, { input }, { dataSources, user })).rejects.toThrowError('No permission');
    await expect(updateTicket(null, { input }, { dataSources, user })).rejects.toThrow(PermissionError);
  });
});
