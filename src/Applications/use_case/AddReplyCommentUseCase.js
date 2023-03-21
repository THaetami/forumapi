const AddReplyComment = require('../../Domains/replies/entities/AddReplyComment');

class AddReplyCommentUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, credentialId, useCaseParams) {
    const { content } = new AddReplyComment(useCasePayload);
    await this._threadRepository.verifyThreadList(useCaseParams);
    await this._commentRepository.verifyCommentList(useCaseParams);
    const addedReplyComment = await this._replyRepository.addReplyComment(
      content,
      credentialId,
      useCaseParams,
    );

    return addedReplyComment;
  }
}

module.exports = AddReplyCommentUseCase;
