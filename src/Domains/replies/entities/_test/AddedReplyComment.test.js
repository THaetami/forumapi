const AddedReplyComment = require('../AddedReplyComment');

describe('a AddedReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'Dicoding content',
    };

    // Action and Assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'dicoding',
      owner: 'tatang',
    };

    // Action and Assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'dicoding',
      owner: 'tatang',
    };

    // Action
    const addedReplyComment = new AddedReplyComment(payload);

    // Assert
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(addedReplyComment.owner).toEqual(payload.owner);
  });
});
