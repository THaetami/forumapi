const AddedReplyComment = require('../../Domains/replies/entities/AddedReplyComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgeres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyComment(content, owner, useCaseParams) {
    const { commentId } = useCaseParams;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, commentId, date],
    };

    const result = await this._pool.query(query);

    return new AddedReplyComment({ ...result.rows[0] });
  }

  async verifyReplyCommentOwner({ replyId }, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan komentar tidak ditemukan');
    }
    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReplyComment({ replyId }) {
    const isDelete = true;
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING id, content, owner, is_delete',
      values: [isDelete, replyId],
    };

    await this._pool.query(query);
  }

  async getReplyByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, comments.id AS comment_id, users.username, replies.date, replies.content, replies.is_delete
        FROM replies
        JOIN users ON users.id = replies.owner
        JOIN comments ON replies.comment_id = comments.id
        WHERE comments.thread_id = $1 ORDER BY date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((entry) => new DetailReply({
      ...entry, commentId: entry.comment_id, isDeleted: entry.is_delete,
    }));
  }
}

module.exports = ReplyRepositoryPostgeres;
