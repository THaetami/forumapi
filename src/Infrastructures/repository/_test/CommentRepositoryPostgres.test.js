const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addCommentThread function', () => {
    it('should persist AddedComment and return correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-rarangInComment', username: 'rarangInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-rarangInComment', credentialId: 'user-rarangInComment' });
      const content = 'content comment rarangInComment';

      const fakeIdGenerator = () => 'rarangInComment';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addCommentThread(content, 'user-rarangInComment', { threadId: 'thread-rarangInComment' });
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-rarangInComment',
        content: 'content comment rarangInComment',
        owner: 'user-rarangInComment',
      }));
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return an empty array when no comments exist from the thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-gugunInComment', username: 'gugunInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-gugunInComment', credentialId: 'user-gugunInComment' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      const result = await commentRepositoryPostgres.getCommentByThreadId('thread-gugunInComment');
      expect(result).toStrictEqual([]);
    });

    it('should return all comments from thread and return correctly', async () => {
      const firstComment = {
        id: 'comment-rurungInComment', date: '2023', content: 'rurung comment', isDeleted: false, replies: [], likeCount: 0,
      };
      const secondComment = {
        id: 'comment-rurungInCommentSecond', date: '2023', content: 'rurung second comment', isDeleted: false, replies: [], likeCount: 0,
      };
      await UsersTableTestHelper.addUser({ id: 'user-rurungInComment', username: 'rurungInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-rurungInComment', credentialId: 'user-rurungInComment' });

      await CommentsTableTestHelper.addCommentThread({ id: 'comment-rurungInComment', content: 'rurung comment', owner: 'user-rurungInComment', threadId: 'thread-rurungInComment', date: '2023' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-rurungInCommentSecond', content: 'rurung second comment', owner: 'user-rurungInComment', threadId: 'thread-rurungInComment', date: '2023' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.getCommentByThreadId('thread-rurungInComment');
      expect(result).toEqual(
        [
          new DetailComment({ ...firstComment, username: 'rurungInComment' }),
          new DetailComment({ ...secondComment, username: 'rurungInComment' }),
        ],
      );
    });
  });

  describe('verifyCommentThreadOwner function', () => {
    it('should throw NotFoundError when commentId not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(commentRepositoryPostgres.verifyCommentThreadOwner('comment-notFound', 'user-notfound')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when commentId not owner ', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-tutungInComment', username: 'tutungInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-tutungInComment', credentialId: 'user-tutungInComment' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-tutungInComment', owner: 'user-tutungInComment', threadId: 'thread-tutungInComment' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(commentRepositoryPostgres.verifyCommentThreadOwner('comment-tutungInComment', 'user-mangjai')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError when commentId available with owner a.k.a credentialId', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-tulungInComment', username: 'tulungInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-tulungInComment', credentialId: 'user-tulungInComment' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-tulungInComment', owner: 'user-tulungInComment', threadId: 'thread-tulungInComment' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(commentRepositoryPostgres.verifyCommentThreadOwner('comment-tulungInComment', 'user-tulungInComment')).resolves.not.toThrowError(NotFoundError);
      expect(commentRepositoryPostgres.verifyCommentThreadOwner('comment-tulungInComment', 'user-tulungInComment')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentThread function', () => {
    it('should delete refreshToken in database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-huhungInComment', username: 'huhungInComment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-huhungInComment', credentialId: 'user-huhungInComment' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-huhungInComment', owner: 'user-huhungInComment', threadId: 'thread-huhungInComment' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteCommentThread('comment-huhungInComment');

      const result = await CommentsTableTestHelper.findCommentById('comment-huhungInComment');
      expect(result.is_delete).toEqual(true);
    });
  });

  describe('verifyCommentList function', () => {
    it('should throw NotFoundError when commentId not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(commentRepositoryPostgres.verifyCommentList({ commentId: 'comment-notFound' })).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError and AuthorizationError when commentId available with owner a.k.a credentialId', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-ja-in-comment', username: 'ja-in-comment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-ja-in-comment', credentialId: 'user-ja-in-comment' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-ja-in-comment', owner: 'user-ja-in-comment', threadId: 'thread-ja-in-comment' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(commentRepositoryPostgres.verifyCommentList({ commentId: 'comment-ja-in-comment' })).resolves.not.toThrowError(NotFoundError);
    });
  });
});
