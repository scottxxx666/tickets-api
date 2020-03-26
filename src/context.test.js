const context = require('./context');
const { decodeToken } = require('./components/user');

jest.mock('./components/user');

let req;

beforeEach(function () {
  jest.resetAllMocks();
  req = { get: jest.fn() };
  givenAuthToken('authHeader');
});

function givenAuthToken(token) {
  req.get.mockReturnValue(token);
}

test('Contains user if providing auth token', function () {
  decodeToken.mockReturnValue({ user: 'user' });
  returnContains({ user: 'user' });
});

function returnContains(object) {
  expect(context({ req })).toEqual(expect.objectContaining(object));
}

test('Contains user null if no auth token', function () {
  givenAuthToken(undefined);
  returnContains({ user: null });
});

test('Not contains user if providing invalid auth token', function () {
  givenInvalidToken();
  expect(() => context({ req })).toThrowError(Error);
});

function givenInvalidToken() {
  decodeToken.mockImplementation(() => {
    throw new Error('invalid token');
  });
}

