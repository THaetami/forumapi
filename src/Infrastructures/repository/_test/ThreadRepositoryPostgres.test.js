const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist AddThread and return correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-gariInThread',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'gariInThread',
      });

      const registerThread = {
        title: 'thread gariInThread',
        body: 'thread body gariInThread',
      };

      const fakeIdGenerator = () => 'gariInThread';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(registerThread, 'user-gariInThread');

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-gariInThread');
      expect(threads).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-lonalInThread',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'lonalInThread',
      });

      const credentialId = 'user-lonalInThread';

      const registerThread = {
        title: 'thread title',
        body: 'thread body',
      };

      const fakeIdGenerator = () => 'lonalInThread';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(registerThread, credentialId);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-lonalInThread',
        title: 'thread title',
        owner: 'user-lonalInThread',
      }));
    });
  });

  describe('verifyThreadList', () => {
    it('should throw NotFoundErro when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      expect(threadRepositoryPostgres.verifyThreadList('thread-notFound')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-ronaldoInThread', username: 'ronaldoInThread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-ronaldoInThread', credentialId: 'user-ronaldoInThread' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const result = await threadRepositoryPostgres.verifyThreadList({ threadId: 'thread-ronaldoInThread' });
      expect(result).toHaveLength(1);
      await expect(threadRepositoryPostgres.verifyThreadList({ threadId: 'thread-ronaldoInThread' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreabById('thread-notFound')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available and return correctly', async () => {
      const getThread = {
        id: 'thread-haeroniInThread',
        title: 'dicoding title',
        body: 'body thread',
        date: '19970911',
        username: 'haeroniInThread',
      };

      await UsersTableTestHelper.addUser({ id: 'user-haeroniInThread', username: 'haeroniInThread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-haeroniInThread', credentialId: 'user-haeroniInThread' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const result = await threadRepositoryPostgres.getThreabById('thread-haeroniInThread');
      expect(result).toStrictEqual(getThread);
      await expect(threadRepositoryPostgres.getThreabById('thread-haeroniInThread')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
