const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');

describe('endpoints CRUD /comments', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 when add comment based on threadId', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'jajaInCommentTest',
        password: 'passjajaInCommentTest',
        fullname: 'jaja kkula',
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

      const threadId = 'thread-jajaInCommentTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });

      const commentPayload = {
        content: 'somekind of comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(201);
      const responseCommentJson = JSON.parse(response.payload);
      expect(responseCommentJson.status).toEqual('success');
      expect(responseCommentJson.data).toBeDefined();
      expect(responseCommentJson.data.addedComment).toBeDefined();
      expect(responseCommentJson.data.addedComment.id).toBeDefined();
      expect(responseCommentJson.data.addedComment.content).toBeDefined();
      expect(responseCommentJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when add comment payload not contain needed property', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'hanInCommentTest',
        password: 'passhanInCommentTest',
        fullname: 'han kkula',
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

      const threadId = 'thread-hanInCommentTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });

      const commentPayload = {};

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const responseCommentJson = JSON.parse(response.payload);
      expect(responseCommentJson.status).toEqual('fail');
      expect(responseCommentJson.message).toEqual('tidak dapat berkomentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when add comment payload not meet data type specification', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'yanInCommentTest',
        password: 'passyanInCommentTest',
        fullname: 'han kkula',
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

      const threadId = 'thread-yanInCommentTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });

      const commentPayload = {
        content: 78976,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const responseCommentJson = JSON.parse(response.payload);
      expect(responseCommentJson.status).toEqual('fail');
      expect(responseCommentJson.message).toEqual('tidak dapat berkomentar karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response with 200 when success delete comment', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'gunInCommentTest',
        password: 'passgunInCommentTest',
        fullname: 'gun kkula',
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

      const threadId = 'thread-gunInCommentTest';
      const commentId = 'comment-gunInCommentTest';

      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response with 403 when someone tries to delete comment that they dont own', async () => {
      const server = await createServer(container);

      // user Gung added thread and comment
      const userIdGung = 'user-gungInComTest';
      const threadId = 'thread-gungInComTest';
      const commentId = 'comment-gungInComTest';

      await UsersTableTestHelper.addUser({ id: userIdGung, username: 'gungInComTest' });
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userIdGung });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userIdGung, threadId });

      // create user and login 2
      const userMakPayload = {
        username: 'makInComTest',
        password: 'passmakInComTest',
        fullname: 'mak kkula',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userMakPayload,
      });

      const responseAuthMak = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userMakPayload.username,
          password: userMakPayload.password,
        },
      });

      const responseAuthMakJson = JSON.parse(responseAuthMak.payload);
      const accessTokenMak = responseAuthMakJson.data.accessToken;

      // user Mak trying delete comment user Gung
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenMak}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });
  });
});
