'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-1001',
        username: 'host_anna',
        password_hash: 'hashed_password_1',
        role: 'HOST',
        full_name: 'Anna Host',
        email: 'anna.host@test.com',
        created_at: new Date(),
      },
      {
        school_id: '2099-1002',
        username: 'player_ben',
        password_hash: 'hashed_password_2',
        role: 'PLAYER',
        full_name: 'Ben Player',
        email: 'ben.player@test.com',
        created_at: new Date(),
      },
      {
        school_id: '2099-1003',
        username: 'player_cara',
        password_hash: 'hashed_password_3',
        role: 'PLAYER',
        full_name: 'Cara Player',
        email: 'cara.player@test.com',
        created_at: new Date(),
      },
      {
        school_id: '2099-1004',
        username: 'player_dan',
        password_hash: 'hashed_password_4',
        role: 'PLAYER',
        full_name: 'Dan Player',
        email: 'dan.player@test.com',
        created_at: new Date(),
      },
      {
        school_id: '2099-1005',
        username: 'player_ella',
        password_hash: 'hashed_password_5',
        role: 'PLAYER',
        full_name: 'Ella Player',
        email: 'ella.player@test.com',
        created_at: new Date(),
      },
      {
        school_id: '2099-1099',
        username: 'never_joined',
        password_hash: 'hashed_password_9',
        role: 'PLAYER',
        full_name: 'Never Joined',
        email: 'never.joined@test.com',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};