# Development journey: Library Mayhem API

Student: Janaisah D. Amatonding · Section: 3-2 · Group: TEAM 12

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: November 20–26, 2026 · Time spent: 8 hours
- Goal: Install the kit and add register, login, and me endpoints
- What I built:
  - password_hash migration and demo-passwords seeder
  - POST /auth/register
  - POST /auth/login
  - GET /auth/me
  - Updated User model (username + password_hash)
  - Demo password: DemoPass123
  - Added GET /users and PATCH /users/:id/role (ADMIN only)
- Evidence: PR #5 · commits on feature/auth
- Problem I hit:
  - username column was required but missing in model
  - JWT_SECRET was in .env but not exported by env.js
  - token.sign was not a function
  - /me returned Authentication required because currentUser ran after the auth routes
- How I solved it: 
  - Added username and password_hash to the User model
  - Exported JWT_SECRET from env.js
  - Fixed token.js and current-user.js (payload.user_id)
  - Applied currentUser middleware on the /me route itself
- Decision I made and why: Used the official kit so the check workflow stays correct
- Changes to my design set: none
- What I would explain to a classmate: We need a JWT secret so login tokens can be signed securely, and the password is never returned in the response

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
