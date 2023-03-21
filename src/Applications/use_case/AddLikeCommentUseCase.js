class AddLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCaseParams, credentialId) {
    await this._threadRepository.verifyThreadList(useCaseParams);
    await this._commentRepository.verifyCommentList(useCaseParams);

    if (await this._likeCommentRepository.checkLikeIsExists(useCaseParams, credentialId)) {
      await this._likeCommentRepository.deleteLike(useCaseParams, credentialId);
    } else {
      await this._likeCommentRepository.addLike(useCaseParams, credentialId);
    }
  }
}

module.exports = AddLikeCommentUseCase;
