const AuthenticationRepository = require('../AuthenticationRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AuthenticationTableTestHelper = require('../../../../test/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const TruncateTableTestHelper = require('../../../../test/TruncateTableTestHelper');

describe('AuthenticationPostgres', () => {
  afterAll(async () => {
    await TruncateTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addRefreshToken function', () => {
    it('should add token to database', async () => {
      const authenticationRepository = new AuthenticationRepository(pool);
      const token = 'token-example';

      await authenticationRepository.addRefreshToken(token);

      // Assert
      const tokens = await AuthenticationTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when refreshToken not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepository(pool);

      // Action and Assert
      await expect(authenticationRepository.verifyRefreshToken('dicoding', 'verify')).rejects.toThrowError(InvariantError);
      await expect(authenticationRepository.verifyRefreshToken('dicoding', 'deleted')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when refreshToken available', async () => {
      // Arrange
      await AuthenticationTableTestHelper.addToken('dicoding'); // memasukan refreshToken baru
      const authenticationRepository = new AuthenticationRepository(pool);

      // Action and Assert
      await expect(authenticationRepository.verifyRefreshToken('dicoding', 'verify')).resolves.not.toThrowError(InvariantError);
      await expect(authenticationRepository.verifyRefreshToken('dicoding', 'deleted')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteRefreshToken function', () => {
    it('should delete refreshToken in database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepository(pool);
      const token = 'token-123';

      await authenticationRepository.addRefreshToken(token);

      await authenticationRepository.deleteRefreshToken(token);

      // Assert
      const refreshTokens = await AuthenticationTableTestHelper.findToken(token);

      expect(refreshTokens).toHaveLength(0);
    });
  });
});
