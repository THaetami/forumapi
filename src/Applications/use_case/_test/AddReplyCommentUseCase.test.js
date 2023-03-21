const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');
const AddReplyComment = require('../../../Domains/replies/entities/AddReplyComment');
const AddedReplyComment = require('../../../Domains/replies/entities/AddedReplyComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrating the add replay comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content comment',
    };

    const thread = [
      {
        id: 'thread-9099988',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-123',
      },
    ];

    const credentialId = 'user-123';

    const useCaseParams = {
      threadId: 'thread-9099988',
      commentId: 'comment-909988',
    };

    const { content } = new AddReplyComment(useCasePayload);

    const addedReplyComment = new AddedReplyComment({
      id: useCaseParams.threadId,
      content: 'dicoding content',
      owner: credentialId,
    });

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.verifyCommentList = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(addedReplyComment));

    // creating use case instance
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // action
    const result = await addReplyCommentUseCase.execute(useCasePayload, credentialId, useCaseParams);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentList).toBeCalledWith(useCaseParams);
    expect(result).toStrictEqual(addedReplyComment);
    expect(mockReplyRepository.addReplyComment).toBeCalledWith(content, credentialId, useCaseParams);
  });
});
