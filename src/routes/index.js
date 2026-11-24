'use strict';

const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Open endpoints (no login needed)
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/results', require('./results.routes'));

// From here, req.user is set (or null)
router.use(currentUser);

// Protected modules (Week 11)
router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));

module.exports = router;