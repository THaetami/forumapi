const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../test/ReplyTableTestHelper');

describe('endpoints /replies CRUD', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 when add reply based on comment', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'ganomRepTest',
        password: 'passganomRepTest',
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

      const threadId = 'thread-ganomRepTest';
      const commentId = 'comment-ganomRepTest';
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });

      const replyPayload = {
        content: 'ganomRepTest comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(201);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 400 when add reply payload not contain needed property', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'jaiRepTest',
        password: 'passjaiRepTest',
        fullname: 'jai kkula',
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

      const threadId = 'thread-jaiRepTest';
      const commentId = 'comment-jaiRepTest';

      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });

      const replyPayload = {};

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const responseCommentJson = JSON.parse(response.payload);
      expect(responseCommentJson.status).toEqual('fail');
      expect(responseCommentJson.message).toEqual('tidak dapat membalas komentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when add reply payload not meet data type specification', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'opiRepTest',
        password: 'passopiRepTest',
        fullname: 'opi kkula',
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

      const threadId = 'thread-opiRepTest';
      const commentId = 'comment-opiRepTest';

      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });

      const replyPayload = {
        content: 78976,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const reponseJson = JSON.parse(response.payload);
      expect(reponseJson.status).toEqual('fail');
      expect(reponseJson.message).toEqual('tidak dapat membalas komentar karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/${replyId}', () => {
    it('should response with 200 when success delete comment', async () => {
      const server = await createServer(container);
      const userPayload = {
        username: 'sanInRepTest',
        password: 'passsanInRepTest',
        fullname: 'san kkula',
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

      const threadId = 'thread-sanInRepTest';
      const commentId = 'comment-sanInRepTest';
      const replyId = 'reply-sanInRepTest';

      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userId });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userId, threadId });
      await ReplyTableTestHelper.AddReply({ id: replyId, owner: userId, commentId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 403 when someone tries to delete reply that they dont own', async () => {
      const server = await createServer(container);

      // user Qun added thread, comment and reply
      const userIdQun = 'user-qunInRepTest';
      const threadId = 'thread-qunInRepTest';
      const commentId = 'comment-qunInRepTest';
      const replyId = 'reply-qunInRepTest';

      await UsersTableTestHelper.addUser({ id: userIdQun, username: 'qunInRepTest' });
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: userIdQun });
      await CommentsTableTestHelper.addCommentThread({ id: commentId, owner: userIdQun, threadId });
      await ReplyTableTestHelper.AddReply({ id: replyId, owner: userIdQun, commentId });

      // create user and login 2
      const userPayload = {
        username: 'kahnRepTest',
        password: 'passkahnRepTest',
        fullname: 'kahn kkula',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const responseAuthKahn = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const responseAuthKahnJson = JSON.parse(responseAuthKahn.payload);
      const accessTokenKahn = responseAuthKahnJson.data.accessToken;

      // user Kahn trying delete comment user Qun
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenKahn}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });
  });
});
