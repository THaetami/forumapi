const PutAuthenticationUser = require('../PutAuthenticationUser');

describe('a PutAuthenticationUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      //
    };

    // Action and Assert
    expect(() => new PutAuthenticationUser(payload)).toThrowError('PUT_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };

    // Action and Assert
    expect(() => new PutAuthenticationUser(payload)).toThrowError('PUT_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PutAuthenticationUser object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'dicongg',
    };

    // Action
    const { refreshToken } = new PutAuthenticationUser(payload);

    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
