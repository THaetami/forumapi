const RegisteredUser = require('../../../Domains/users/entities/RegistredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUserUseCase = require('../AddUserUseCase');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

describe('AddUserUserCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indon',
    };

    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    // creating dependency of use cases
    const mockUserRepository = new UserRepository();
    const mocPasswordHash = new PasswordHash();

    // mocking needed function
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mocPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredUser));

    // creating use case instance
    const getUserUseCase = new AddUserUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mocPasswordHash,
    });

    // action
    const regiteredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(regiteredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mocPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
  });
});
