'use strict';

const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

async function join(req, res) {
  const { code, nickname } = matchedData(req);
  const { session, player, created } = await playerService.join(code, nickname, req.user);

  res.status(created ? 201 : 200).json({
    player_id: player.player_id,
    nickname: player.nickname,
    score: player.score,
    rejoined: !created,
    session: {
      code: session.session_code,
      status: session.status,
    },
  });
}

module.exports = {
  join,
};