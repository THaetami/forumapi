const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyCommentUseCase', () => {
  it('should orchestrating the delete reply comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-komen-bae-hyung',
      threadId: 'thread-kocak-mang',
      replyId: 'reply-bacot-lier',
    };

    const thread = [
      {
        id: 'thread-kocak-mang',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-mang-nana',
      },
    ];

    const credentialId = 'user-mang-nana';

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.verifyCommentList = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // action
    await deleteReplyCommentUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentList).toBeCalledWith(useCaseParams);
    expect(mockReplyRepository.verifyReplyCommentOwner).toBeCalledWith(useCaseParams, credentialId);
    expect(mockReplyRepository.deleteReplyComment).toBeCalledWith(useCaseParams);
  });
});
