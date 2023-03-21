const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplayCommentHandler = this.postReplayCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postReplayCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name);
    const addedReply = await addReplyCommentUseCase.execute(request.payload, credentialId, request.params);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);
    await deleteReplyCommentUseCase.execute(request.params, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ReplyHandler;
