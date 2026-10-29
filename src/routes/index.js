// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');
const hubKey = require('../middlewares/hub-key');

const router = Router();

// Hub Contract endpoints: open to everyone, so they come before currentUser.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));

// Results needs the Hub key (must never be public)
router.use('/results', hubKey, require('./results.routes'));

// From here on, req.user says who is calling (or null).
router.use(currentUser);

router.use('/question-sets', require('./question-set.routes'));

module.exports = router;