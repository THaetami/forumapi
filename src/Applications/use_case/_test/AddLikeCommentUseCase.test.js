const AddLikeCommentUseCase = require('../AddLikeCommentUseCase');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');

describe('AddLikeCommentUseCase', () => {
  it('should orchestrate the add like use case properly when like doesnt exist', async () => {
    // Arrange

    const useCaseParams = {
      commentId: 'comment-filaLikeUseCase',
      threadId: 'thread-filaLikeUseCase',
    };

    const thread = [
      {
        id: 'thread-filaLikeUseCase',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-filaLikeUseCase',
      },
    ];

    const credentialId = 'user-filaLikeUseCase';

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mocklikeCommentRepository = new LikeCommentRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.verifyCommentList = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mocklikeCommentRepository.checkLikeIsExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mocklikeCommentRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      likeCommentRepository: mocklikeCommentRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    await addLikeCommentUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentList).toBeCalledWith(useCaseParams);
    expect(mocklikeCommentRepository.checkLikeIsExists).toBeCalledWith(useCaseParams, credentialId);
    expect(mocklikeCommentRepository.addLike).toBeCalledWith(useCaseParams, credentialId);
  });

  it('should orchestrate the add like use case properly when like does exist', async () => {
    // Arrange

    const useCaseParams = {
      commentId: 'comment-findaLikeUseCase',
      threadId: 'thread-findaLikeUseCase',
    };

    const thread = [
      {
        id: 'thread-findaLikeUseCase',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        owner: 'user-findaLikeUseCase',
      },
    ];

    const credentialId = 'user-findaLikeUseCase';

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mocklikeCommentRepository = new LikeCommentRepository();

    // mocking needed function
    mockThreadRepository.verifyThreadList = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.verifyCommentList = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mocklikeCommentRepository.checkLikeIsExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mocklikeCommentRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      likeCommentRepository: mocklikeCommentRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    await addLikeCommentUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyThreadList).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentList).toBeCalledWith(useCaseParams);
    expect(mocklikeCommentRepository.checkLikeIsExists).toBeCalledWith(useCaseParams, credentialId);
    expect(mocklikeCommentRepository.deleteLike).toBeCalledWith(useCaseParams, credentialId);
  });
});
