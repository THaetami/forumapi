/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTestTableHelper = {
  async AddReply({
    id = 'replay-123',
    content = 'content title',
    owner = 'user-123',
    commentId = 'comment-123',
    date = '19970911',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner, date',
      values: [id, content, owner, commentId, date],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTestTableHelper;
