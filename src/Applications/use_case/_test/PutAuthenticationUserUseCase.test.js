const AuthenticationRepository = require('../../../Domains/authentication/AuthenticationRepository');
const TokenManager = require('../../../Domains/tokenize/TokenManager');
const PutAuthenticationUserUseCase = require('../PutAuthenticationUserUseCase');
const PutAuthenticationUser = require('../../../Domains/authentication/entities/PutAuthenticationUser');

describe('PutAuthenticationUserUseCase', () => {
  it('should orchestrating the PutAuthenticationUserUseCase action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };
    const action = 'verify';

    const { refreshToken } = new PutAuthenticationUser(useCasePayload);

    // creating dependency of use cases
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockTokenManager = new TokenManager();

    mockAuthenticationRepository.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));

    mockTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('refresh_token_new'));

    // creating use case instance
    const putAuthenticationUserUseCase = new PutAuthenticationUserUseCase({
      tokenManager: mockTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // action
    const regiteredAuthentication = await putAuthenticationUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.verifyRefreshToken)
      .toBeCalledWith(refreshToken, action);

    expect(mockTokenManager.verifyRefreshToken)
      .toBeCalledWith(refreshToken);

    expect(mockTokenManager.generateAccessToken)
      .toBeCalledWith({ id: 'user-123' });
    expect(regiteredAuthentication).toEqual('refresh_token_new');
  });
});
