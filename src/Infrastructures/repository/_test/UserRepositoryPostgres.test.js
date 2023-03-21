const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegistredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgeres');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');

describe('UserRepositoryPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyUsernameCredential function', () => {
    it('should throw InvariantError when username not found in database', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUsernameCredential('not-found-username')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username found in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-yukiInUser', username: 'yukiInUser' }); // memasukan username baru
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      const result = await userRepositoryPostgres.verifyUsernameCredential('yukiInUser');
      expect(result).toEqual({ id: 'user-yukiInUser', password: 'secret' });
      await expect(userRepositoryPostgres.verifyUsernameCredential('yukiInUser')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available for use', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-haeroniInUser', username: 'haeroniInUser' }); // memasukan username baru
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('haeroniInUser')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available for use', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('haeronayInUser')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        id: 'user-ranggaInUser',
        username: 'ranggaInUser',
        password: 'secret_password',
        fullname: 'dibayar Indonesia',
      });
      const fakeIdGenerator = () => 'ranggaInUser'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-ranggaInUser');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'konahInUser',
        password: 'secret_password',
        fullname: 'Dicoding Indon',
      });

      const fakeIdGenerator = () => 'konahInUser'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      //   Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-konahInUser',
        username: 'konahInUser',
        fullname: 'Dicoding Indon',
      }));
    });
  });
});
