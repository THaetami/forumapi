const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../test/LikesTableTestHelper');

describe('endpoints ADD likes', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when add like based on comment', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'gundamLikeTest',
        password: 'passgundamLikeTest',
        fullname: 'ganom kkula',
      };

      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const { accessToken } = (JSON.parse(responseAuth.payload)).data;

      const threadId = 'thread-gundamLikeTest';
      const commentId = 'comment-gundamLikeTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when delete like based on comment', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'dundInLikeTest',
        password: 'passdundInLikeTest',
        fullname: 'dundInLikeTest kkula',
      };

      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const { accessToken } = (JSON.parse(responseAuth.payload)).data;

      const threadId = 'thread-dundInLikeTest';
      const commentId = 'comment-dundInLikeTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });
      await LikesTableTestHelper.addLike({ id: 'like-dundInLikeTest', commentId, owner: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when add like but not authentication', async () => {
      const threadId = 'thread-notFound';
      const commentId = 'comment-notFound';
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when add like but threadId not found', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'astaInLikeTest',
        password: 'passastaInLikeTest',
        fullname: 'astaInLikeTest kkula',
      };

      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const { accessToken } = (JSON.parse(responseAuth.payload)).data;

      const threadId = 'thread-notFound';
      const commentId = 'comment-notFound';

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when add like but commentId not found', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'asgaInLikeTest',
        password: 'passasgaInLikeTest',
        fullname: 'asgaInLikeTest kkula',
      };

      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const { accessToken } = (JSON.parse(responseAuth.payload)).data;

      const commentId = 'comment-notFound';
      const threadId = 'thread-asgaInLikeTest';

      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
