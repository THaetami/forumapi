const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('comparePass function', () => {
    it('should throw error when compare password not match', async () => {
      // Arrange
      const bcryptHelper = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'rahasia';
      const passwordHash = 'rahasia_ilahi';

      // Action and Assert
      await expect(bcryptHelper.comparePass(plainPassword, passwordHash)).rejects.toThrowError(AuthenticationError);
    });

    it('should not throw error when compare password correctly', async () => {
      // Arrange
      const bcryptHelper = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'rahasia';
      const passwordHash = await bcryptHelper.hash(plainPassword);

      // Action and Assert
      const result = await bcryptHelper.comparePass(plainPassword, passwordHash);
      expect(result).toEqual(true);
      await expect(bcryptHelper.comparePass(plainPassword, passwordHash)).resolves.not.toThrowError(AuthenticationError);
    });
  });
});
