const { signUp, login } = require('./index');
const userRepo = require('./user-repository');
const { getOpenIdAndUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');
const DuplicatedError = require('./error/duplicate-error');
const NotFoundError = require('./error/not-found-error');

jest.mock('./user-repository');
jest.mock('./platform/google');
jest.mock('./token');

beforeEach(function () {
  jest.resetAllMocks();
});

const dataSources = { userRepo, userOpenIdLoader: { load: jest.fn() } };

describe('signUp', () => {
  beforeEach(function () {
    givenUserInput({});
    givenUserNotExists();
  });

  function givenUserNotExists() {
    dataSources.userOpenIdLoader.load.mockResolvedValue(null);
  }

  test('Return token and user', async function () {
    givenToken('token');
    givenUserCreated('user');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  function givenUserCreated(user) {
    userRepo.createUser.mockResolvedValue(user);
  }

  async function shouldReturn(expected) {
    await expect(signUp(null, { platform: 'platform' }, { dataSources })).resolves.toStrictEqual(expected);
  }

  test('Use token to get user input', async function () {
    await signUp(null, { token: 'fakeToken' }, { dataSources });
    await expect(getOpenIdAndUserInput).toBeCalledWith('fakeToken');
  });

  test('Create new user', async function () {
    givenUserInput('userInput');
    await signUp(null, {}, { dataSources });
    expect(userRepo.createUser).toBeCalledWith('userInput');
  });

  function givenUserInput(userInput) {
    getOpenIdAndUserInput.mockResolvedValue({ userInput });
  }

  test('If user exists', async function () {
    givenUserAlreadyExists();
    await expect(signUp(null, {}, { dataSources })).rejects.toThrowError(DuplicatedError);
    await expect(signUp(null, {}, { dataSources })).rejects.toThrowError('User already exists');
  });

  function givenUserAlreadyExists() {
    dataSources.userOpenIdLoader.load.mockResolvedValue({});
  }
});

function givenToken(token) {
  Token.generate.mockReturnValue(token);
}

describe('login', function () {
  beforeEach(function () {
    givenUser('user');
  });

  function givenUser(user) {
    dataSources.userOpenIdLoader.load.mockResolvedValue(user);
  }

  test('Return user and token', async function () {
    givenUser('user');
    givenToken('token');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  async function shouldReturn(expected) {
    await expect(login(null, {}, { dataSources })).resolves.toStrictEqual(expected);
  }

  test('Throw error if no user', async function () {
    givenUser(null);
    await expect(login(null, {}, { dataSources })).rejects.toThrowError(NotFoundError);
    await expect(login(null, {}, { dataSources })).rejects.toThrowError('User not found');
  });

  test('Use token to get open id', async function () {
    await login(null, { token: 'newFakeToken' }, { dataSources });
    expect(getOpenId).toBeCalledWith('newFakeToken');
  });

  test('Use open id to get the user', async function () {
    givenOpenId('openId');
    await login(null, {}, { dataSources });
    expect(dataSources.userOpenIdLoader.load).toBeCalledWith('openId');
  });

  function givenOpenId(openId) {
    getOpenId.mockReturnValue(openId);
  }

  test('Use user to generate token', async function () {
    givenUser('fakeUser');
    await login(null, {}, { dataSources });
    expect(Token.generate).toBeCalledWith('fakeUser');
  });
});
