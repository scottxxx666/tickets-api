const { signUp, login } = require('./index');
const { createUser, getUserByOpenId } = require('./user-repository');
const { getOpenIdAndUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');
const DuplicatedError = require('./error/duplicate-error');
const NotFoundError = require('./error/duplicate-error');

jest.mock('./user-repository');
jest.mock('./platform/google');
jest.mock('./token');

beforeEach(function () {
  jest.resetAllMocks();
});

describe('signUp', () => {
  beforeEach(function () {
    getOpenIdAndUserInput.mockResolvedValue({});
  });

  test('Return token and user', async function () {
    givenToken('token');
    givenUserCreated('user');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  function givenUserCreated(user) {
    createUser.mockResolvedValue(user);
  }

  async function shouldReturn(expected) {
    await expect(signUp(null, { platform: 'platform' })).resolves.toStrictEqual(expected);
  }

  test('Use token to get user input', async function () {
    await signUp(null, { token: 'fakeToken' });
    await expect(getOpenIdAndUserInput).toBeCalledWith('fakeToken');
  });

  test('Create new user', async function () {
    givenUserInput('userInput');
    await signUp(null, {});
    expect(createUser).toBeCalledWith('userInput');
  });

  function givenUserInput(userInput) {
    getOpenIdAndUserInput.mockResolvedValue({ userInput });
  }

  test('If user exists', async function () {
    getUserByOpenId.mockResolvedValue({});
    await expect(signUp(null, {})).rejects.toThrowError(new DuplicatedError('User already exists'));
  });
});

function givenToken(token) {
  Token.generate.mockReturnValue(token);
}

describe('login', function () {
  beforeEach(function () {
    givenUser('user');
  });

  function givenUser(user) {
    getUserByOpenId.mockResolvedValue(user);
  }

  test('Return user and token', async function () {
    givenUser('user');
    givenToken('token');
    await shouldReturn({ token: 'token', user: 'user' });
  });

  async function shouldReturn(expected) {
    await expect(login(null, {})).resolves.toStrictEqual(expected);
  }

  test('Throw error if no user', async function () {
    givenUser(null);
    await expect(login(null, {})).rejects.toThrowError(new DuplicatedError('User not found'));
  });

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
