const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the getted threads action correctly', async () => {
    // Arrange
    const useCaseParams = 'thread-istInThreadCase';

    const expectedDetailThread = {
      id: 'thread-istInThreadCase',
      title: 'some thread title',
      body: 'some thread body',
      date: '2020',
      username: 'istInThreadCase',
      comments: [],
    };

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

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.getThreabById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedComments));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedReplies));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      LikeCommentRepository: {},
    });

    // filtering retrievedComments to remove isDeleted and likeCount
    const {
      isDeleted: isDeletedCommentA,
      ...filteredCommentDetailsA
    } = retrievedComments[0];
    const {
      isDeleted: isDeletedCommentB,
      ...filteredCommentDetailsB
    } = retrievedComments[1];

    // filtering retrievedReplies to removed commentId and isDeleted
    const {
      commentId: commentIdReplyA, isDeleted: isDeletedReplyA,
      ...filteredReplyDetailsA
    } = retrievedReplies[0];
    const {
      commentId: commentIdReplyB, isDeleted: isDeletedReplyB,
      ...filteredReplyDetailsB
    } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...filteredCommentDetailsA, replies: [filteredReplyDetailsA] },
      { ...filteredCommentDetailsB, replies: [filteredReplyDetailsB] },
    ];

    getThreadUseCase._checkDeletedComments = jest.fn()
      .mockImplementation(() => [filteredCommentDetailsA, filteredCommentDetailsB]);

    getThreadUseCase._getRepliesForComments = jest.fn()
      .mockImplementation(() => expectedCommentsAndReplies);

    getThreadUseCase._getLikeCountForComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentsAndReplies));

    // action
    const getThread = await getThreadUseCase.execute(useCaseParams);

    expect(getThread).toEqual({
      ...expectedDetailThread, comments: expectedCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreabById).toBeCalledWith(useCaseParams);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCaseParams);

    expect(getThreadUseCase._checkDeletedComments).toBeCalledWith(retrievedComments);
    expect(getThreadUseCase._getRepliesForComments).toBeCalledWith([filteredCommentDetailsA, filteredCommentDetailsB], retrievedReplies);
    expect(getThreadUseCase._getLikeCountForComments).toBeCalledWith(expectedCommentsAndReplies);
  });

  it('should operate _checkDeletedComments function in GetThreadUseCase', () => {
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {}, commentRepository: {}, replyRepository: {}, likeCommentRepository: {},
    });
    const retrievedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: 'comment A',
        replies: [],
        isDeleted: true,
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

    const {
      isDeleted: isDeletedCommentA,
      ...filteredCommentDetailsA
    } = retrievedComments[0];
    const {
      isDeleted: isDeletedCommentB,
      ...filteredCommentDetailsB
    } = retrievedComments[1];

    const SpyCheckDeletedComments = jest.spyOn(getThreadUseCase, '_checkDeletedComments');
    getThreadUseCase._checkDeletedComments(retrievedComments);
    expect(SpyCheckDeletedComments).toReturnWith([{ ...filteredCommentDetailsA, content: '**komentar telah dihapus**' }, filteredCommentDetailsB]);
    SpyCheckDeletedComments.mockClear();
  });

  it('should operate _getRepliesForComments function in GetThreadUseCase', () => {
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {}, commentRepository: {}, replyRepository: {}, likeCommentRepository: {},
    });
    const filteredComments = [
      {
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: '**komentar telah dihapus**',
        replies: [],
        likeCount: 0,
      },
      {
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [],
        likeCount: 0,
      },
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: true,
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
    const {
      commentId: commentIdReplyA, isDeleted: isDeletedReplyA,
      ...filteredReplyDetailsA
    } = retrievedReplies[0];
    const {
      commentId: commentIdReplyB, isDeleted: isDeletedReplyB,
      ...filteredReplyDetailsB
    } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...filteredComments[0], replies: [{ ...filteredReplyDetailsA, content: '**balasan telah dihapus**' }] },
      { ...filteredComments[1], replies: [filteredReplyDetailsB] },
    ];

    const SpyGetRepliesForComments = jest.spyOn(getThreadUseCase, '_getRepliesForComments');
    getThreadUseCase._getRepliesForComments(filteredComments, retrievedReplies);
    expect(SpyGetRepliesForComments).toReturnWith(expectedCommentsAndReplies);
    SpyGetRepliesForComments.mockClear();
  });

  it('should operate _getLikeCountForComments function in GetThreadUseCase', async () => {
    const commentsParam = [
      {
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: '**komentar telah dihapus**',
        replies: [{
          id: 'reply-123',
          content: 'reply A',
          date: '2021',
          username: 'user C',
        }],
        likeCount: 0,
      },
      {
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [{
          id: 'reply-456',
          content: 'reply B',
          date: '2021',
          username: 'user D',
        }],
        likeCount: 0,
      },
    ];

    const expectedComments = [
      { ...commentsParam[0], likeCount: 2 }, { ...commentsParam[1], likeCount: 0 },
    ];

    const mockLikeCommentRepository = new LikeCommentRepository();
    mockLikeCommentRepository.getCountLikeByCommentId = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-123' ? 2 : 0));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {}, commentRepository: {}, replyRepository: {}, likeCommentRepository: mockLikeCommentRepository,
    });

    const SpyGetLikeCountForComments = jest.spyOn(getThreadUseCase, '_getLikeCountForComments');

    const result = await getThreadUseCase._getLikeCountForComments(commentsParam);

    // assert
    expect(result).toEqual(expectedComments);
    expect(mockLikeCommentRepository.getCountLikeByCommentId).toBeCalledTimes(2);
    SpyGetLikeCountForComments.mockClear();
  });
});
