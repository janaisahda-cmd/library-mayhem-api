'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      "SELECT 1 FROM users WHERE school_id = '2099-1000'"
    );
    if (rows.length > 0) return;
    await queryInterface.bulkInsert('users', [{
      school_id: '2099-1000',
      username: 'admin_demo',
      full_name: 'Demo Admin',
      email: 'admin.demo@test.com',
      password_hash: await bcrypt.hash('DemoPass123', 10),
      role: 'ADMIN',
      created_at: new Date(),
    }]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-1000' });
  },
};