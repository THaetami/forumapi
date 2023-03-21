const AddReplyComment = require('../AddReplyComment');

describe('a AddReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrowError('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrowError('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReplyComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'content comment',
    };

    // Action
    const { content } = new AddReplyComment(payload);

    expect(content).toEqual(payload.content);
  });
});
