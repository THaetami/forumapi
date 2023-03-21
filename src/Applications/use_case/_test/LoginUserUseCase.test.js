const AddAuthenticatedUser = require('../../../Domains/authentication/entities/AddAuthenticatedUser');
const AddAuthenticationUser = require('../../../Domains/authentication/entities/AddAuthenticationUser');
const AuthenticationRepository = require('../../../Domains/authentication/AuthenticationRepository');
const TokenManager = require('../../../Domains/tokenize/TokenManager');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const { username, password } = new AddAuthenticationUser(useCasePayload);

    const mockAddAuthenticatedUser = new AddAuthenticatedUser({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    // creating dependency of use cases
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockTokenManager = new TokenManager();

    // mocking needed function
    mockUserRepository.verifyUsernameCredential = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', password: 'encrypted_password' }));

    mockPasswordHash.comparePass = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddAuthenticatedUser.accessToken));

    mockTokenManager.generateRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddAuthenticatedUser.refreshToken));

    mockAuthenticationRepository.addRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      tokenManager: mockTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // action
    const regiteredAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(regiteredAuthentication).toEqual(new AddAuthenticatedUser({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.verifyUsernameCredential)
      .toBeCalledWith(username);

    expect(mockPasswordHash.comparePass)
      .toBeCalledWith(password, 'encrypted_password');

    expect(mockTokenManager.generateAccessToken)
      .toBeCalledWith({ id: 'user-123' });

    expect(mockTokenManager.generateRefreshToken)
      .toBeCalledWith({ id: 'user-123' });

    expect(mockAuthenticationRepository.addRefreshToken)
      .toBeCalledWith(mockAddAuthenticatedUser.refreshToken);
  });
});
