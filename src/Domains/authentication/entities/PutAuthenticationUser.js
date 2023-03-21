class PutAuthenticationUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { refreshToken } = payload;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('PUT_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('PUT_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PutAuthenticationUser;
