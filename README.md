# Kanban Board with Authentication

A secure Kanban board application with JWT authentication.

## Features

- Secure login system using JWT authentication
- Protected routes for authenticated users only
- Auto-logout functionality for inactive sessions
- CRUD operations for Kanban tickets
- Responsive modern UI

## Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=3001
JWT_SECRET=your_secure_jwt_secret_key
DB_NAME=kanban_db
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
```

## Seeding the Database

To create test users:

```bash
cd server
npm run build
npm run seed
```

Test Users:
- Username: `testuser`, Password: `password123`
- Username: `admin`, Password: `admin123`

## Running the Application

### Development Mode

```bash
# Start the server
cd server
npm run dev

# In a new terminal, start the client
cd client
npm run dev
```

### Production Mode

```bash
# Build the client
cd client
npm run build

# Start the server (which serves the client build)
cd ../server
npm start
```

## Authentication Flow

1. User enters username/password on the login page
2. Server validates credentials and returns a JWT token
3. Client stores the token in localStorage
4. Protected routes check for a valid token
5. Session expires after 30 minutes of inactivity