# JWT Authentication Assignment

This project has:

- `backend` - Express.js server with JWT authentication
- `frontend` - React app for register, login and protected route access

## Main features

- Register a user with username and password
- Login and get JWT token
- Save token in localStorage
- Access protected route using token
- Logout button to clear token
- Password is hashed using `bcryptjs`

## Backend setup

1. Open terminal in `backend`
2. Run `npm install`
3. Run `npm start`

Server runs on `http://localhost:5000`

## Frontend setup

1. Open another terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev`

Frontend runs on `http://localhost:5173`

## Notes

- This is still a learning project, so it is intentionally simple.
- JWT secret is stored using environment variables.
- Passwords are not stored in plain text now. They are hashed using `bcryptjs`.
- Frontend stores token in localStorage just for learning purposes.
