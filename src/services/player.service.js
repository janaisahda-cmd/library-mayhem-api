'use strict';

const sessionRepository = require('../repositories/session.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // Rejoin: same account already has a seat
  const existing = await sessionRepository.findPlayer(session.session_id, user.user_id);
  if (existing) {
    return { session, player: existing, created: false };
  }

  // New seat only while LOBBY
  if (session.status === 'CLOSED') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'LOBBY') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  const seatsTaken = await sessionRepository.countPlayers(session.session_id);
  if (seatsTaken >= 15) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  try {
    const player = await sessionRepository.createPlayer({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
    });
    return { session, player, created: true };
  } catch (error) {
    if (constraintOf(error) === 'players_session_id_user_id_key') {
      const existing2 = await sessionRepository.findPlayer(session.session_id, user.user_id);
      return { session, player: existing2, created: false };
    }
    throw error;
  }
}

module.exports = {
  join,
};