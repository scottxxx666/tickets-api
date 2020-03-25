const { signUp, login } = require('./index');
const { createUser, getUserByOpenId } = require('./user-repository');
const { getUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');

jest.mock('./user-repository');
jest.mock('./platform/google');
jest.mock('./token');

beforeEach(function () {
  jest.resetAllMocks();
});

describe('signUp', () => {
  test('Return token and user', async function () {
    givenToken('token');
    givenUserCreated('user');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  function givenUserCreated(user) {
    createUser.mockResolvedValue(user);
  }

  async function shouldReturn(expected) {
    await expect(signUp(null, {})).resolves.toStrictEqual(expected);
  }

  test('Use token to get user input', async function () {
    await signUp(null, { token: 'fakeToken' });
    await expect(getUserInput).toBeCalledWith('fakeToken');
  });

  test('Create new user', async function () {
    givenUserInput('userInput');
    await signUp(null, {});
    expect(createUser).toBeCalledWith('userInput');
  });

  function givenUserInput(userInput) {
    getUserInput.mockResolvedValue(userInput);
  }
});

function givenToken(token) {
  Token.generate.mockReturnValue(token);
}

describe('login', function () {
  test('Return user and token', async function () {
    givenUser('user');
    givenToken('token');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  function givenUser(user) {
    getUserByOpenId.mockResolvedValue(user);
  }

  async function shouldReturn(expected) {
    await expect(login(null, {})).resolves.toStrictEqual(expected);
  }

  test('Use token to get open id', async function () {
    await login(null, { token: 'newFakeToken' });
    expect(getOpenId).toBeCalledWith('newFakeToken');
  });

  test('Use open id to get the user', async function () {
    givenOpenId('openId');
    await login(null, {});
    expect(getUserByOpenId).toBeCalledWith('openId');
  });

  function givenOpenId(openId) {
    getOpenId.mockReturnValue(openId);
  }

  test('Use user to generate token', async function () {
    givenUser('fakeUser');
    await login(null, {});
    expect(Token.generate).toBeCalledWith('fakeUser');
  });
});
