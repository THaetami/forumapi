const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReplyComment = require('../../../Domains/replies/entities/AddedReplyComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ReplyTableTestHelper = require('../../../../test/ReplyTableTestHelper');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReplyComment function', () => {
    it('should persist AddedReplyComment and return correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-rumsiInReply', username: 'rumsiInReply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-rumsiInReply', credentialId: 'user-rumsiInReply' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-rumsiInReply', owner: 'user-rumsiInReply', threadId: 'thread-rumsiInReply' });

      const content = 'content reply rumsi';
      const fakeIdGenerator = () => 'rumsiInReply';
      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const addedReplyComment = await replyRepositoryPostgeres.addReplyComment(content, 'user-rumsiInReply', { commentId: 'comment-rumsiInReply' });
      expect(addedReplyComment).toStrictEqual(new AddedReplyComment({
        id: 'reply-rumsiInReply',
        content: 'content reply rumsi',
        owner: 'user-rumsiInReply',
      }));
    });
  });

  describe('verifyReplyCommentOwner function', () => {
    it('should throw NotFoundError when replyId not found', async () => {
      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, {});
      expect(replyRepositoryPostgeres.verifyReplyCommentOwner({ replyId: 'reply-notFound' }, 'user-notfound')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply replyId not available for owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-ranInReply', username: 'ranInReply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-ranInReply', credentialId: 'user-ranInReply' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-ranInReply', owner: 'user-ranInReply', threadId: 'thread-ranInReply' });
      await ReplyTableTestHelper.AddReply({ id: 'reply-ranInReply', owner: 'user-ranInReply', commentId: 'comment-ranInReply' });

      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, {});
      expect(replyRepositoryPostgeres.verifyReplyCommentOwner({ replyId: 'reply-ranInReply' }, 'user-santana')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError when replyId available for owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-runInReply', username: 'runInReply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-runInReply', credentialId: 'user-runInReply' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-runInReply', owner: 'user-runInReply', threadId: 'thread-runInReply' });
      await ReplyTableTestHelper.AddReply({ id: 'reply-runInReply', owner: 'user-runInReply', commentId: 'comment-runInReply' });

      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, {});
      expect(replyRepositoryPostgeres.verifyReplyCommentOwner({ replyId: 'reply-runInReply' }, 'user-runInReply')).resolves.not.toThrowError(NotFoundError);
      expect(replyRepositoryPostgeres.verifyReplyCommentOwner({ replyId: 'reply-runInReply' }, 'user-runInReply')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyComment function', () => {
    it('should soft delete reply commnet in database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-renInReply', username: 'renInReply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-renInReply', credentialId: 'user-renInReply' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-renInReply', owner: 'user-renInReply', threadId: 'thread-renInReply' });
      await ReplyTableTestHelper.AddReply({ id: 'reply-renInReply', owner: 'user-renInReply', commentId: 'comment-renInReply' });

      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgeres.deleteReplyComment({ replyId: 'reply-renInReply' });

      const result = await ReplyTableTestHelper.findReplyById('reply-renInReply');
      expect(result.is_delete).toEqual(true);
    });
  });

  describe('getReplyByThreadId function', () => {
    it('should persist AddedComment and return correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-wanInReply', username: 'wanInReply' });
      await UsersTableTestHelper.addUser({ id: 'user-twoInReply', username: 'twoInReply' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-wanInReply', credentialId: 'user-wanInReply' });

      await CommentsTableTestHelper.addCommentThread({ id: 'comment-wanInReply', owner: 'user-wanInReply', threadId: 'thread-wanInReply' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-twoInReply', owner: 'user-twoInReply', threadId: 'thread-wanInReply' });

      const replyA = {
        id: 'reply-wanInReply', commentId: 'comment-wanInReply', content: 'reply wanInReply', date: '2020', isDeleted: false,
      };
      const replyB = {
        id: 'reply-twoInReply', commentId: 'comment-twoInReply', content: 'reply twoInReply', date: '2021', isDeleted: false,
      };

      const expectedReplies = [
        { ...replyA, username: 'wanInReply' }, { ...replyB, username: 'twoInReply' },
      ];

      await ReplyTableTestHelper.AddReply({ ...replyA, owner: 'user-wanInReply' });
      await ReplyTableTestHelper.AddReply({ ...replyB, owner: 'user-twoInReply' });

      const replyRepositoryPostgeres = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepositoryPostgeres.getReplyByThreadId('thread-wanInReply');
      expect(result).toEqual(expectedReplies);
    });
  });
});
