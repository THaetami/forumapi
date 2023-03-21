const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);

    await addLikeCommentUseCase.execute(request.params, credentialId);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
