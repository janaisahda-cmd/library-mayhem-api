'use strict';

const { GameSession, Player } = require('../models');

function findByCode(code) {
  return GameSession.findOne({ where: { session_code: code } });
}

function findById(id) {
  return GameSession.findByPk(id);
}

function create(data) {
  return GameSession.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

function findPlayer(sessionId, userId) {
  return Player.findOne({
    where: { session_id: sessionId, user_id: userId },
  });
}

function createPlayer(data) {
  return Player.create(data);
}

function countPlayers(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

module.exports = {
  findByCode,
  findById,
  create,
  update,
  findPlayer,
  createPlayer,
  countPlayers,
};