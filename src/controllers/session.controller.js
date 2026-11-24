'use strict';

const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  return {
    id: session.session_id,
    code: session.session_code,
    status: session.status,
    set_id: session.set_id,
    host_id: session.host_id,
    created_at: session.created_at,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const { question_set_id } = matchedData(req);
  const session = await sessionService.create(question_set_id, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req);
  const session = await sessionService.get(code);
  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code, status } = matchedData(req);
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = {
  create,
  get,
  changeStatus,
};