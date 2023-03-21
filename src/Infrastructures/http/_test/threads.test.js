const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../test/CommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../test/ReplyTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const ServerTestHelper = require('../../../../test/ServerTestHelper');

describe('endpoint CRUD /threads', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'title thread',
        body: 'body thread',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(201);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when access token a.k.a authentication not found', async () => {
      const requestPayload = {
        title: 'title thread',
        body: 'body thread',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload add thread not contain needed property', async () => {
      const requestPayload = {
        title: 'title thread',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat manambahkan thread karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload add thread not meet data type specification', async () => {
      const requestPayload = {
        title: 'title thread',
        body: [23455],
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat manambahkan thread karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response with 200 with thread details, comment and replies', async () => {
      const server = await createServer(container);

      const threadId = 'thread-dicoInThreads';
      await UsersTableTestHelper.addUser({ id: 'user-dicoInThreads', username: 'dicoInThreads' });
      await UsersTableTestHelper.addUser({ id: 'user-jhonChenInThreads', username: 'jhonChenInThreads' });
      await ThreadsTableTestHelper.addThread({ id: threadId, credentialId: 'user-dicoInThreads' });
      await CommentsTableTestHelper.addCommentThread({ id: 'comment-dicoInThreads', owner: 'user-dicoInThreads', threadId });
      await ReplyTableTestHelper.AddReply({ id: 'reply-dicoInThreads', owner: 'user-dicoInThreads', commentId: 'comment-dicoInThreads' });
      await ReplyTableTestHelper.AddReply({ id: 'reply-jhonChenInThreads', owner: 'user-jhonChenInThreads', commentId: 'comment-dicoInThreads' });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(2);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
