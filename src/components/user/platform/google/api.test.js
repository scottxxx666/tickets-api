const api = require('./api');
const { OAuth2Client } = require('google-auth-library');
const AuthInvalidError = require('../auth-invalid-error');

jest.mock('google-auth-library');

describe('getValidUserInfo', function () {
  test('return user id and payload', async function () {
    given('fakeUserId', 'fakePayload');
    await shouldReturn({ openId: 'fakeUserId', payload: 'fakePayload' });
  });

  test('throw error if aud not equal client id', async function () {
    given('fakeUserId', { aud: 'wrong aud' });
    await shouldThrow(new AuthInvalidError('Invalid aud'));
  });

  function given(userId, payload) {
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: () => ({
        getUserId: () => userId,
        getPayload: () => payload,
      }),
    }));
  }

  async function shouldReturn(expected) {
    await expect(api.getValidUserInfo()).resolves.toStrictEqual(expected);
  }

  async function shouldThrow(error) {
    await expect(api.getValidUserInfo()).rejects.toThrow(error);
  }
});
