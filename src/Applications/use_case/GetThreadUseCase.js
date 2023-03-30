class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCaseParams) {
    const thread = await this._threadRepository.getThreabById(useCaseParams);
    thread.comments = await this._commentRepository.getCommentByThreadId(useCaseParams);
    const threadReplies = await this._replyRepository.getReplyByThreadId(useCaseParams);
    console.log(threadReplies);
    for (let i = 0; i < thread.comments.length; i += 1) {
      const commentId = thread.comments[i].id;
      thread.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });
      thread.comments[i].likeCount = await this._likeCommentRepository.getCountLikeByCommentId(commentId);
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
