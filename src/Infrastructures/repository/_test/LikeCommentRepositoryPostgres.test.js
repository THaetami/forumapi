const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../test/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');

describe('LikesRepositoryPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add likes_comment in database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-arangInLike', username: 'arangInLike' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-arangInLike', credentialId: 'user-arangInLike' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-arangInLike', owner: 'user-arangInLike', threadId: 'thread-arangInLike' });

      const fakeIdGenerator = () => 'arangInLike';
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);
      await likeCommentRepositoryPostgres.addLike({ commentId: 'comment-arangInLike' }, 'user-arangInLike');

      const result = await LikesTableTestHelper.findLikeById('like-arangInLike');
      expect(result[0]).toEqual({
        id: 'like-arangInLike',
        owner: 'user-arangInLike',
        comment_id: 'comment-arangInLike',
      });
    });
  });

  describe('deleteLike function', () => {
    it('should delete likes_comment in database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-etanaInLike', username: 'etanaInLike' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-etanaInLike', credentialId: 'user-etanaInLike' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-etanaInLike', owner: 'user-etanaInLike', threadId: 'thread-etanaInLike' });
      await LikesTableTestHelper.addLike({ id: 'like-etanaInLike', commentId: 'comment-etanaInLike', owner: 'user-etanaInLike' });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      await likeCommentRepositoryPostgres.deleteLike({ commentId: 'comment-etanaInLike' }, 'user-etanaInLike');

      const result = await LikesTableTestHelper.findLikeById('like-etanaInLike');
      expect(result).toHaveLength(0);
    });
  });

  describe('checkLikeIsExists function', () => {
    it('checkLikeIsExists should return true if like exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-kulanInLike', username: 'kulanInLike' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-kulanInLike', credentialId: 'user-kulanInLike' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-kulanInLike', owner: 'user-kulanInLike', threadId: 'thread-kulanInLike' });
      await LikesTableTestHelper.addLike({ id: 'like-kulanInLike', commentId: 'comment-kulanInLike', owner: 'user-kulanInLike' });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeCommentRepositoryPostgres.checkLikeIsExists({ commentId: 'comment-kulanInLike' }, 'user-kulanInLike');
      expect(statusCheck).toEqual(true);
    });

    it('checkLikeIsExists should return false if like does not exists', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeCommentRepositoryPostgres.checkLikeIsExists({ commentId: 'comment-notfound' }, 'user-notfound');
      expect(statusCheck).toEqual(false);
    });
  });

  describe('getCountLikeByCommentId function', () => {
    it('should get right like count', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-unaInLike', username: 'unaInLike' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-unaInLike', credentialId: 'user-unaInLike' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-unaInLike', owner: 'user-unaInLike', threadId: 'thread-unaInLike' });
      await LikesTableTestHelper.addLike({ id: 'like-unaInLike', commentId: 'comment-unaInLike', owner: 'user-unaInLike' });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {}, {});
      const countLike = await likeCommentRepositoryPostgres.getCountLikeByCommentId('comment-unaInLike');
      expect(countLike).toEqual(1);
    });

    it('should get right like count', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {}, {});
      const countLike = await likeCommentRepositoryPostgres.getCountLikeByCommentId('comment-notFound');
      expect(countLike).toEqual(0);
    });
  });
});
