'use strict';

module.exports = {
  players_session_id_user_id_key: {
    status: 409,
    code: 'ALREADY_JOINED',
    message: 'You already have a seat in this game.',
  },
  players_session_id_nickname_key: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  game_sessions_session_code_key: {
    status: 409,
    code: 'CODE_TAKEN',
    message: 'That session code is already in use.',
  },
};