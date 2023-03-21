const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
  }

  async postCommentThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name);
    const addedComment = await addCommentThreadUseCase.execute(request.payload, credentialId, request.params);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);
    await deleteCommentThreadUseCase.execute(request.params, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
