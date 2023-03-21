class DeleteReplyCommentUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams, credentialId) {
    await this._threadRepository.verifyThreadList(useCaseParams);
    await this._commentRepository.verifyCommentList(useCaseParams);
    await this._replyRepository.verifyReplyCommentOwner(useCaseParams, credentialId);
    await this._replyRepository.deleteReplyComment(useCaseParams);
  }
}

module.exports = DeleteReplyCommentUseCase;
