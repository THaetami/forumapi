const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePass(plainPassword, hashedPasword) {
    const result = await this._bcrypt.compare(plainPassword, hashedPasword);
    if (!result) {
      throw new AuthenticationError('kredensial yang anda masukan salah');
    }
    return result;
  }
}

module.exports = BcryptPasswordHash;
