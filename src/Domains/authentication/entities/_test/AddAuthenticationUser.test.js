const AddAuthenticationUser = require('../AddAuthenticationUser');

describe('a AddAuthenticationUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
    };

    // Action and Assert
    expect(() => new AddAuthenticationUser(payload)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: 'abc',
    };

    // Action and Assert
    expect(() => new AddAuthenticationUser(payload)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddAuthenticationUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicongg',
      password: 'abc',
    };

    // Action
    const { username, password } = new AddAuthenticationUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
