const api = require('./api');
const { getOpenId, getUserInput } = require('./index');

jest.mock('./api');

let result;

beforeEach(function () {
  jest.resetAllMocks();
});

describe('getOpenId', function () {
  test('Return open id', async function () {
    givenResponse('open id');
    await shouldReturn('open id');
  });

  async function shouldReturn(openId) {
    result = await getOpenId('token');
    expect(result).toBe(openId);
  }
});

function givenResponse(openId, payload) {
  api.getValidUserInfo.mockResolvedValue({ openId, payload });
}

describe('getUserInput', function () {
  test('Should call api with token', async function () {
    await givenInput('fakeToken');
    shouldCall(api.getValidUserInfo).toHaveBeenCalledWith('fakeToken');

    async function givenInput(token) {
      givenResponse('openId', { name: 'name' });
      await getUserInput(token);
    }

    function shouldCall(api) {
      return expect(api);
    }
  });

  test('Return open id, name, email', async function () {
    givenResponse('openId', { name: 'name' });
    await shouldReturn({ name: 'name', email: null, openIds: [{ platform: 'GOOGLE', openId: 'openId' }] });
  });

  async function shouldReturn(expected) {
    result = await getUserInput('token');
    expect(result).toStrictEqual(expected);
  }

  test('Return email if contained and verified', async function () {
    givenResponseContains({ email: 'fake@email', email_verified: true });
    await shouldReturnContains({ email: 'fake@email' });
  });

  test('Return email null if not contained', async function () {
    givenResponseContains({ email_verified: true });
    await shouldReturnContains({ email: null });
  });

  test('Return email null if email null', async function () {
    givenResponseContains({ email: null, email_verified: true });
    await shouldReturnContains({ email: null });
  });

  test('Return email null if email verified false', async function () {
    givenResponseContains({ email: 'email', email_verified: false });
    await shouldReturnContains({ email: null });
  });

  async function shouldReturnContains(object) {
    result = await getUserInput('token');
    expect(result).toStrictEqual(expect.objectContaining(object));
  }

  function givenResponseContains(fields) {
    givenResponse('openId', { name: 'name', ...fields });
  }
});

