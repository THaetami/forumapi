const PutAuthenticationUser = require('../../Domains/authentication/entities/PutAuthenticationUser');

class PutAuthenticationUserUseCase {
  constructor({ tokenManager, authenticationRepository }) {
    this._tokenManager = tokenManager;
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new PutAuthenticationUser(useCasePayload);

    const action = 'verify';

    await this._authenticationRepository.verifyRefreshToken(refreshToken, action);

    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.generateAccessToken({ id });

    return accessToken;
  }
}

module.exports = PutAuthenticationUserUseCase;
