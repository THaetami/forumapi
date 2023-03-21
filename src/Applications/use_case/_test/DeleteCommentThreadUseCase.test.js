const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentThreadUseCase', () => {
  it('should orchestrating the delete comment threads action correctly', async () => {
    // Arrange

    const useCaseParams = {
      commentId: 'comment-123djisamsoe',
      threadId: 'thread-sampoerna123',
    };

    const thread = [
      {
        id: 'thread-sampoerna123',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-tatang',
      },
    ];

    const credentialId = 'user-tatang';

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.verifyCommentThreadOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    await deleteCommentThreadUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentThreadOwner).toBeCalledWith(useCaseParams.commentId, credentialId);
    expect(mockCommentRepository.deleteCommentThread).toBeCalledWith(useCaseParams.commentId);
  });
});
