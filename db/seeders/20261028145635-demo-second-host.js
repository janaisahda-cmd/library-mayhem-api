'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0003',
        username: 'host_ben',
        password_hash: 'hashed_password_ben',
        role: 'HOST',
        full_name: 'Ben Host',
        email: 'ben.host@test.com',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0003' }, {});
  },
};