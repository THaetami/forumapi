const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const registerThread = new AddThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(registerThread, credentialId);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
