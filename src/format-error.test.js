const formatError = require('./format-error');
const { AuthenticationError, ApolloError, ForbiddenError, UserInputError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');
const NotFoundError = require('./components/user/error/not-found-error');
const PermissionError = require('./components/ticket/errors/permission-error');
const ResourceNotFoundError = require('./components/ticket/errors/resource-not-found-error');

let result;

function givenInput(error) {
  result = formatError(new ApolloError(error.message, undefined, { originalError: error }));
}

function shouldReturnInstance(expected) {
  expect(result).toBeInstanceOf(expected);
}

describe('Should return normal error', function () {
  test('Given normal input', function () {
    givenInput(new Error);
    shouldReturnInstance(Error);
  });
});

describe('Should throw AuthenticationError', function () {
  test('Given error message starts with Token', function () {
    givenInput(new Error('Token '));
    shouldReturnInstance(AuthenticationError);
  });

  test('Given error message starts with Context', function () {
    givenInput(new Error('Context'));
    shouldReturnInstance(AuthenticationError);
  });

  test('Given DuplicateError', function () {
    givenInput(new DuplicateError);
    shouldReturnInstance(AuthenticationError);
  });

  test('Given NotFoundError', function () {
    givenInput(new NotFoundError);
    shouldReturnInstance(AuthenticationError);
  });
});

describe('Should throw ForbiddenError', function () {
  test('Given PermissionError', function () {
    givenInput(new PermissionError);
    shouldReturnInstance(ForbiddenError);
  });
});

describe('Should throw UserInputError', function () {
  test('Given ResourceNotFoundError', function () {
    givenInput(new ResourceNotFoundError);
    shouldReturnInstance(UserInputError);
  });
});
