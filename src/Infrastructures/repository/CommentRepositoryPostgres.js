const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentThread(content, owner, threadId) {
    const { threadId: idThread } = threadId;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, idThread, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete
        FROM comments
        JOIN users ON users.id = comments.owner
        WHERE comments.thread_id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((entry) => new DetailComment({
      ...entry, isDeleted: entry.is_delete, replies: [], likeCount: 0,
    }));
  }

  async verifyCommentThreadOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCommentThread(id) {
    const isDelete = true;
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING id, content, owner, is_delete',
      values: [isDelete, id],
    };

    await this._pool.query(query);
  }

  async verifyCommentList({ commentId }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
