const AddComent = require('../../Domains/comments/entities/AddComment');

class AddCommentThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId, threadId) {
    const { content } = new AddComent(useCasePayload);
    await this._threadRepository.verifyThreadList(threadId);
    const addedComment = await this._commentRepository.addCommentThread(
      content,
      credentialId,
      threadId,
    );

    return addedComment;
  }
}

module.exports = AddCommentThreadUseCase;
