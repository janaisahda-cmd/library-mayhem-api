# CS 313 Week 11 Kit

Shared files for Week 11: error classes, the central error handler, validation,
request logging and a temporary way to say who is calling. They are the same for
every team. Your modules (repositories, services, validators, controllers, routes)
are your own.

## Install (Lab Step 1)

1. Copy the `src` and `scripts` folders of this kit into the top folder of your
   repository. Say yes when asked to replace `src/app.js`,
   `src/routes/index.js` and `src/middlewares/error-handler.js`.
2. Install the two new packages:

   ```
   npm install express-validator morgan
   ```

3. In `package.json`, replace the `db:reset` line with this one:

   ```
   "db:reset": "node scripts/db-wipe.js && sequelize-cli db:migrate && sequelize-cli db:seed:all",
   ```

   The Week 10 version stops working once your API has created rows.
4. In `src/models/index.js`, load the `User` model and export it. If you already
   wrote a `User` model, keep yours and delete the one in this kit.

   ```
   const User = require('./user')(sequelize, DataTypes);
   module.exports = { sequelize, Sequelize, DataTypes, User };
   ```

5. Run `npm run dev`. `GET /api/v1/health` must still answer 200.

## What each file does

| File | Job |
|---|---|
| `src/errors/app-error.js` | Errors the client may see: status, code, message |
| `src/errors/db-errors.js` | Finds which database constraint an error broke |
| `src/errors/constraint-map.js` | YOURS: turns each constraint into a status, code and message |
| `src/middlewares/error-handler.js` | One place that sends every error, in one shape |
| `src/middlewares/validate.js` | Stops a request with 400 when a validation rule fails |
| `src/middlewares/current-user.js` | TEMPORARY: reads the `X-Demo-User` header into `req.user` |
| `src/middlewares/require-user.js` | Guards a route: 401 without an account, 403 with the wrong role |
| `src/repositories/user.repository.js` | Finds an account by school ID |
| `src/models/user.js` | The `users` table from Design Change Notice 01 |
| `src/app.js` | Adds request logging (morgan) |
| `src/routes/index.js` | Runs `currentUser`, then your modules |
| `scripts/db-wipe.js` | Empties the database for `npm run db:reset` |

## Saying who you are (Week 11 only)

Login is built in Week 12. Until then, send the school ID of a seeded account:

```
X-Demo-User: 2099-0001
```

This is not security: anyone can type any ID. `current-user.js` refuses to load
when `NODE_ENV=production`. Week 12 replaces the inside of that file, and nothing
else in your code changes.
