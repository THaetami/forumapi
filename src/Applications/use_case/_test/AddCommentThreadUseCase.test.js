const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentThreadUseCase', () => {
  it('should orchestrating the add comment threads action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content comment',
    };

    const thread = [
      {
        id: 'thread-1245',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-123',
      },
    ];

    const credentialId = 'user-123';
    const threadId = 'thread-123';

    const { content } = new AddComment(useCasePayload);

    const addedComment = new AddedComment({
      id: threadId,
      content,
      owner: credentialId,
    });

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.addCommentThread = jest.fn()
      .mockImplementation(() => Promise.resolve(addedComment));

    // creating use case instance
    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = await addCommentThreadUseCase.execute(useCasePayload, credentialId, threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(threadId);
    expect(result).toStrictEqual(addedComment);
    expect(mockCommentRepository.addCommentThread).toBeCalledWith(content, credentialId, threadId);
  });
});
