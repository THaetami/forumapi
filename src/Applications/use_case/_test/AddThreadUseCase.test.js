const Addedthread = require('../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepositroy');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add threads action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding title',
      body: 'body thread',
    };

    const credentialId = 'user-123';

    const addThread = new AddThread(useCasePayload);

    const expectedAddedthread = new Addedthread({
      id: 'thread-123',
      title: 'dicoding title',
      owner: 'user-123',
    });

    // creating dependency of use cases
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new Addedthread({
          id: 'thread-123',
          title: 'dicoding title',
          owner: 'user-123',
        }),
      ));

    // creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const addedThread = await getThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedthread);
    expect(mockThreadRepository.addThread).toBeCalledWith(addThread, credentialId);
  });
});
