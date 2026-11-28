# Development journey: Library Mayhem API

Student: Janaisah D. Amatonding · Section: 3-2 · Group: TEAM 12

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: November 20–28, 2026 · Time spent: 8 hours
- Goal: Install the kit and add register, login, and me endpoints, and protect admin routes by role
- What I built:
  - password_hash migration and demo-passwords seeder
  - demo-admin seeder (school ID 2099-1000, role ADMIN)
  - POST /auth/register
  - POST /auth/login
  - GET /auth/me
  - Updated User model (username + password_hash)
  - Added GET /users and PATCH /users/:id/role (ADMIN only)
  - Error codes in the { error: { code, message } } format: INVALID_CREDENTIALS, AUTH_REQUIRED, INVALID_TOKEN
  - A Postman collection with 47 requests in postman/
  - Demo password: DemoPass123
- Evidence: - Evidence: https://github.com/janaisahda-cmd/library-mayhem-api/pull/5 · 7b8a55e · 60a79b1
- Problem I hit:
  - username column was required but missing in model
  - JWT_SECRET was in .env but not exported by env.js
  - token.sign was not a function
  - /me returned Authentication required because currentUser ran after the auth routes
  - My AppError calls had the code and the message in the wrong order, so a failed login returned a sentence in the code field. I found it in a code review and the Postman tests confirmed the fix.
- How I solved it:
  - Added username and password_hash to the User model
  - Exported JWT_SECRET from env.js
  - Fixed token.js and current-user.js (payload.user_id)
  - Applied currentUser middleware on the /me route itself
  - Changed every AppError call to AppError(status, code, message)
- Decision I made and why: I added a separate demo-admin seeder instead of editing my Week 10 seeder, so my earlier work stays unchanged. The cost is that a demo admin exists in local data, so the seeders must never run on the live server. I also used the official kit so the check workflow stays correct.
- Changes to my design set: I added /auth/register, /auth/login, /auth/me, /users and /users/:id/role to the endpoint table. The users table also gained password_hash and username, and I added full_name and email in a later migration.
- What I would explain to a classmate: We need a JWT secret so login tokens can be signed securely, and the password is never returned in the response. A wrong password and an unknown school ID give the same 401, so nobody can find out which accounts exist.
- AI tools: I used AI assistants (Grok and Claude) to explain the steps, to review my auth code, and to generate the Postman collection file. I ran the collection and the check myself and I can explain every request.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
