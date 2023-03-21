const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHARACTER': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'PUT_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan refreshToken'),
  'PUT_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refreshToken harus string'),
  'DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan refreshToken'),
  'DELETE_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refreshToken harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat manambahkan thread karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat manambahkan thread karena tipe data tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat berkomentar karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat berkomentar karena tipe data tidak sesuai'),
  'ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membalas komentar karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membalas komentar karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
