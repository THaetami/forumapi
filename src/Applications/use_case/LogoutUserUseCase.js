const DeleteAuthenticationUser = require('../../Domains/authentication/entities/DeleteAuthenticationUser');

class LogoutUserUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new DeleteAuthenticationUser(useCasePayload);

    const action = 'deleted';
    await this._authenticationRepository.verifyRefreshToken(refreshToken, action);

    await this._authenticationRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = LogoutUserUseCase;
