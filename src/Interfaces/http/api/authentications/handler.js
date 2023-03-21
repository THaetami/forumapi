const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const PutAuthenticationUserUseCase = require('../../../../Applications/use_case/PutAuthenticationUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');

class AuthenticationHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const putAuthenticationUserUseCase = this._container.getInstance(PutAuthenticationUserUseCase.name);
    const accessToken = await putAuthenticationUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationHandler;
