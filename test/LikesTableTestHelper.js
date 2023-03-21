/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', commentId = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes_comment (id, comment_id, owner) VALUES ($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async getLikeByCommentIdAndOwner({ commentId = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await pool.query(query);

    return result.rows[0];
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },

};

module.exports = LikesTableTestHelper;
