const AddAuthenticatedUser = require('../AddAuthenticatedUser');

describe('AddAuthenticatedUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
    };

    // Action & Assert
    expect(() => new AddAuthenticatedUser(payload)).toThrowError('AUTHENTICATED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 1234,
    };

    // Action & Assert
    expect(() => new AddAuthenticatedUser(payload)).toThrowError('AUTHENTICATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddAuthenticatedUser entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const { accessToken, refreshToken } = new AddAuthenticatedUser(payload);

    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
