/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessToken({ server, username = 'bangjago' }) {
    const userPayload = {
      username, password: 'rahasia',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'tatang haetami',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    // const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;
    const { accessToken } = (JSON.parse(responseAuth.payload)).data;
    return { accessToken };
  },
};

module.exports = ServerTestHelper;
