const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetThreadUseCase', () => {
  it('should orchestrating the getted threads action correctly', async () => {
    // Arrange
    const useCaseParams = 'thread-istInThreadCase';

    const expectedDetailThread = {
      id: 'thread-istInThreadCase',
      title: 'thread title',
      body: 'thread body',
      date: '2023',
      username: 'John Doe',
    };

    const retrievedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: 'comment A',
        replies: [],
        isDeleted: false,
        likeCount: 2
      }),
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: false,
      }),
    ];

    const expectedValue = {
        id: 'thread-istInThreadCase',
        title: 'thread title',
        body: 'thread body',
        date: '2023',
        username: 'John Doe',
        comments: [
            {
                id: 'comment-123',
                username: 'user A',
                date: '2021',
                content: 'comment A',
                likeCount: 2,
                replies: [{
                    id: 'reply-123',
                    content: 'reply A',
                    date: '2021',
                    username: 'user C',
                }],
            }
        ]
    }

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    // mocking needed function
    mockThreadRepository.getThreabById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedComments));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedReplies));
    mockLikeCommentRepository.getCountLikeByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(2));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThread = await getThreadUseCase.execute(useCaseParams);
    expect(getThread).toEqual(expectedValue);

    expect(mockThreadRepository.getThreabById).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCaseParams);
    expect(mockLikeCommentRepository.getCountLikeByCommentId('comment-123'));
  });
});
