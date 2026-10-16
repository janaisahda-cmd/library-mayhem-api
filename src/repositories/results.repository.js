'use strict';

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      s.session_code,
      s.started_at,
      s.ended_at,
      u.school_id,
      p.nickname,
      p.score,
      (p.finished_at IS NOT NULL) AS completed
    FROM game_sessions s
    JOIN players p ON p.session_id = s.session_id
    JOIN users u ON u.user_id = p.user_id
    WHERE s.status = 'CLOSED'
      AND (
        :since::timestamptz IS NULL
        OR s.ended_at > :since::timestamptz
      )
    ORDER BY s.ended_at, p.score DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since || null },
  });
}

module.exports = {
  findFinishedGamePlayers,
};