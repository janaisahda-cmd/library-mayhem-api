'use strict';

const { AppError } = require('../errors/app-error');

function requireUser(...roles) {
  const allowed = roles.flat();

  return function (req, res, next) {
    if (!req.user) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication required'));
    }
    if (allowed.length > 0 && !allowed.includes(req.user.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'Forbidden'));
    }
    next();
  };
}

module.exports = requireUser;
module.exports.requireUser = requireUser;