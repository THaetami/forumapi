const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(useCaseParams, owner) {
    const id = `like-${this._idGenerator()}`;
    const { commentId } = useCaseParams;

    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3) RETURNING id',
      values: [id, owner, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(useCaseParams, owner) {
    const { commentId } = useCaseParams;
    const query = {
      text: 'DELETE FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async checkLikeIsExists(useCaseParams, owner) {
    const { commentId } = useCaseParams;
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      return true;
    }
    return false;
  }

  async getCountLikeByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes_comment WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }
}

module.exports = LikeCommentRepositoryPostgres;
