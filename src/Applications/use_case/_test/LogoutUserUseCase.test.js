const AuthenticationRepository = require('../../../Domains/authentication/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');
const DeleteAuthenticationUser = require('../../../Domains/authentication/entities/DeleteAuthenticationUser');

describe('LogoutUserUseCase', () => {
  it('should orchestrating the logout user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };
    const action = 'deleted';

    const { refreshToken } = new DeleteAuthenticationUser(useCasePayload);

    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);
    // Assert
    expect(mockAuthenticationRepository.verifyRefreshToken)
      .toHaveBeenCalledWith(refreshToken, action);
    expect(mockAuthenticationRepository.deleteRefreshToken)
      .toHaveBeenCalledWith(refreshToken);
  });
});
