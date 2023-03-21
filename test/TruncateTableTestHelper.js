const pool = require('../src/Infrastructures/database/postgres/pool');

const TruncateTableTestHelper = {
  async cleanTable() {
    await pool.query('TRUNCATE users, threads, comments, replies, authentications, likes_comment');
  },
};

module.exports = TruncateTableTestHelper;
