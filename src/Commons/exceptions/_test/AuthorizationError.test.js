const AuthorizationError = require('../AuthorizationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authorizationError = new AuthorizationError('authorizationError error!');

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authorizationError error!');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
