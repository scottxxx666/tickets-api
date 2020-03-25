const api = require('./api');
const { getOpenId, getOpenIdAndUserInput } = require('./index');

jest.mock('./api');

let result;

beforeEach(function () {
  jest.resetAllMocks();
});

describe('getOpenId', function () {
  test('Return open id', async function () {
    givenUserInfo('open id');
    await shouldReturn('open id');
  });

  async function shouldReturn(openId) {
    result = await getOpenId('token');
    expect(result).toBe(openId);
  }
});

function givenUserInfo(openId, payload) {
  api.getValidUserInfo.mockResolvedValue({ openId, payload });
}

describe('getOpenIdAndUserInput', function () {
  test('Should call api with token', async function () {
    await givenInput('fakeToken');
    shouldCall(api.getValidUserInfo).toHaveBeenCalledWith('fakeToken');

    async function givenInput(token) {
      givenUserInfo('openId', { name: 'name' });
      await getOpenIdAndUserInput(token);
    }

    function shouldCall(api) {
      return expect(api);
    }
  });

  test('Return user input contains open id, name, email', async function () {
    givenUserInfo('openId', { name: 'name' });
    await shouldReturnUserInput({ name: 'name', email: null, openIds: [{ platform: 'GOOGLE', openId: 'openId' }] });
  });

  async function shouldReturnUserInput(expected) {
    result = await getOpenIdAndUserInput('token');
    expect(result.userInput).toStrictEqual(expected);
  }

  test('Return email if contained and verified', async function () {
    givenPayloadContains({ email: 'fake@email', email_verified: true });
    await shouldReturnContains({ email: 'fake@email' });
  });

  test('Return email null if not contained', async function () {
    givenPayloadContains({ email_verified: true });
    await shouldReturnContains({ email: null });
  });

  test('Return email null if email null', async function () {
    givenPayloadContains({ email: null, email_verified: true });
    await shouldReturnContains({ email: null });
  });

  test('Return email null if email verified false', async function () {
    givenPayloadContains({ email: 'email', email_verified: false });
    await shouldReturnContains({ email: null });
  });

  async function shouldReturnContains(object) {
    result = await getOpenIdAndUserInput('token');
    expect(result.userInput).toStrictEqual(expect.objectContaining(object));
  }

  function givenPayloadContains(fields) {
    givenUserInfo('openId', { name: 'name', ...fields });
  }
});

