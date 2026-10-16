'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Get host and set
    const [[host]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-1001'"
    );
    const [[set]] = await db.query(
      "SELECT set_id FROM question_sets WHERE title = 'Library Mayhem Basics'"
    );

    // Create a CLOSED (finished) game session
    await queryInterface.bulkInsert('game_sessions', [
      {
        session_code: '418263',
        host_id: host.user_id,
        set_id: set.set_id,
        status: 'CLOSED',
        shift_timer_seconds: 300,
        chaos_meter: 25,
        created_at: new Date('2026-10-09T01:00:00Z'),
        started_at: new Date('2026-10-09T01:00:00Z'),
        ended_at: new Date('2026-10-09T01:15:00Z'),
      },
    ]);

    const [[session]] = await db.query(
      "SELECT session_id FROM game_sessions WHERE session_code = '418263'"
    );

    // Get players
    const users = await db.query(
      "SELECT user_id, school_id FROM users WHERE school_id IN ('2099-1002','2099-1003','2099-1004','2099-1005') ORDER BY school_id",
      { type: db.QueryTypes.SELECT }
    );

    // Insert 4 players (3 completed + 1 not completed)
    await queryInterface.bulkInsert('players', [
      {
        session_id: session.session_id,
        user_id: users[0].user_id, // Ben
        nickname: 'Ben',
        score: 15,
        joined_at: new Date('2026-10-09T01:00:00Z'),
        finished_at: new Date('2026-10-09T01:14:00Z'),
      },
      {
        session_id: session.session_id,
        user_id: users[1].user_id, // Cara
        nickname: 'Cara',
        score: 12,
        joined_at: new Date('2026-10-09T01:00:00Z'),
        finished_at: new Date('2026-10-09T01:13:00Z'),
      },
      {
        session_id: session.session_id,
        user_id: users[2].user_id, // Dan
        nickname: 'Dan',
        score: 12, // tie with Cara
        joined_at: new Date('2026-10-09T01:00:00Z'),
        finished_at: new Date('2026-10-09T01:13:30Z'),
      },
      {
        session_id: session.session_id,
        user_id: users[3].user_id, // Ella - did not complete
        nickname: 'Ella',
        score: 3,
        joined_at: new Date('2026-10-09T01:00:00Z'),
        finished_at: null, // not completed
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('players', null, {});
    await queryInterface.bulkDelete('game_sessions', { session_code: '418263' }, {});
  },
};