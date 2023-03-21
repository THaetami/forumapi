class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, credentialId) {
    const { commentId } = useCaseParams;
    await this._threadRepository.verifyThreadList(useCaseParams);
    await this._commentRepository.verifyCommentThreadOwner(commentId, credentialId);
    await this._commentRepository.deleteCommentThread(commentId);
  }
}

module.exports = DeleteCommentThreadUseCase;
