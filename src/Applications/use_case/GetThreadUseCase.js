class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCaseParams) {
    const thread = await this._threadRepository.getThreabById(useCaseParams);
    thread.comments = await this._commentRepository.getCommentByThreadId(useCaseParams);
    const threadReplies = await this._replyRepository.getReplyByThreadId(useCaseParams);

    thread.comments = this._checkDeletedComments(thread.comments);
    thread.comments = this._getRepliesForComments(thread.comments, threadReplies);
    thread.comments = await this._getLikeCountForComments(thread.comments);
    return thread;
  }

  _checkDeletedComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].isDeleted ? '**komentar telah dihapus**' : comments[i].content;
      delete comments[i].isDeleted;
    }
    return comments;
  }

  _getRepliesForComments(comments, threadReplies) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          replyDetail.content = replyDetail.isDeleted ? '**balasan telah dihapus**' : replyDetail.content;
          delete replyDetail.isDeleted;
          return replyDetail;
        });
    }
    return comments;
  }

  async _getLikeCountForComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].likeCount = await this._likeCommentRepository.getCountLikeByCommentId(commentId);
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;
