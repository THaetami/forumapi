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

    const expectedDetailThread = new DetailThread({
      id: 'thread-istInThreadCase',
      title: 'thread title',
      body: 'thread body',
      date: '2023',
      username: 'John Doe',
      comments: [],
    });

    const retrievedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: 'comment A',
        replies: [],
        isDeleted: false,
        likeCount: 0,
      }),
      new DetailComment({
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [],
        isDeleted: false,
        likeCount: 0,
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
      new DetailReply({
        id: 'reply-456',
        commentId: 'comment-456',
        content: 'reply B',
        date: '2021',
        username: 'user D',
        isDeleted: false,
      }),
    ];

    const { commentId: commentIdReplyA, ...filteredReplyDetailsA } = retrievedReplies[0];
    const { commentId: commentIdReplyB, ...filteredReplyDetailsB } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...retrievedComments[0], replies: [filteredReplyDetailsA] },
      { ...retrievedComments[1], replies: [filteredReplyDetailsB] },
    ];

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
      .mockImplementation(() => Promise.resolve(0));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThread = await getThreadUseCase.execute(useCaseParams);
     expect(getThread).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsAndReplies,
    }));

    expect(mockThreadRepository.getThreabById).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams);
  });
});
