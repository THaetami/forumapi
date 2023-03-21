const DeleteAuthenticationUser = require('../DeleteAuthenticationUser');

describe('a DeleteAuthenticationUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      //
    };

    // Action and Assert
    expect(() => new DeleteAuthenticationUser(payload)).toThrowError('DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };

    // Action and Assert
    expect(() => new DeleteAuthenticationUser(payload)).toThrowError('DELETE_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteAuthenticationUser object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'dicongg',
    };

    // Action
    const { refreshToken } = new DeleteAuthenticationUser(payload);

    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
