const AuthenticationRepository = require('../../Domains/authentication/AuthenticationRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool, action) {
    super();
    this._pool = pool;
    this._action = action;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token, action) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount && action === 'verify') {
      throw new InvariantError('refresh token tidak valid');
    }
    if (!result.rowCount && action === 'deleted') {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgres;
