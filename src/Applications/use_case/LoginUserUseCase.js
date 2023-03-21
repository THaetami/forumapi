const AddAuthenticationUser = require('../../Domains/authentication/entities/AddAuthenticationUser');
const AddAuthenticatedUser = require('../../Domains/authentication/entities/AddAuthenticatedUser');

class LoginUserUseCase {
  constructor({
    authenticationRepository, passwordHash, tokenManager, userRepository,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { username, password } = new AddAuthenticationUser(useCasePayload);

    const { id, password: hashedPasword } = await this._userRepository.verifyUsernameCredential(username);

    await this._passwordHash.comparePass(password, hashedPasword);

    const accessToken = await this._tokenManager.generateAccessToken({ id });

    const refreshToken = await this._tokenManager.generateRefreshToken({ id });

    await this._authenticationRepository.addRefreshToken(refreshToken);

    const authenticatedUser = new AddAuthenticatedUser({
      accessToken,
      refreshToken,
    });

    return authenticatedUser;
  }
}

module.exports = LoginUserUseCase;
