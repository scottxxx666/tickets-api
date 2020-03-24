const api = require('./api');
const { OAuth2Client } = require('google-auth-library');

jest.mock('google-auth-library');

describe('getValidUserInfo', function () {
  test('return user id and payload', async function () {
    given('fakeUserId', 'fakePayload');
    await shouldReturn({ openId: 'fakeUserId', payload: 'fakePayload' });
  });

  test('throw error if aud not equal client id', async function () {
    given('fakeUserId', { aud: 'wrong aud' });
    await expect(api.getValidUserInfo()).rejects.toThrowError('Auth error!');
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
});
