# Planora Backend

This repository contains the backend architecture for the Planora Teams Management System.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Socket.io
- Zod validation
- Cloudinary
- Nodemailer
- Helmet
- Morgan
- CORS
- bcryptjs
- UUID

## Getting Started

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   cd server
   pnpm install
   ```
3. Generate Prisma client:
   ```bash
   pnpm prisma:generate
   ```
4. Run the server:
   ```bash
   pnpm dev
   ```

## Features

- User auth and JWT tokens
- Team creation, membership, and invitations
- Team-specific projects and tasks
- Analytics, notifications, and activity logs
- Socket.io based team collaboration
- Cloudinary upload support
- Background cron-style jobs for reminders and cleanup
- Validation with Zod
- Error handling and security middleware

## API Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/teams`
- `GET /api/v1/teams`
- `GET /api/v1/teams/:id`
- `PUT /api/v1/teams/:id`
- `DELETE /api/v1/teams/:id`
- `POST /api/v1/teams/:id/invite`
- `GET /api/v1/teams/:id/members`
- `PUT /api/v1/teams/:id/members/:memberId`
- `GET /api/v1/teams/:id/settings`
- `PUT /api/v1/teams/:id/settings`
- `POST /api/v1/projects`
- `GET /api/v1/projects/team/:teamId`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/team/:teamId`
- `GET /api/v1/analytics/team/:teamId`
- `GET /api/v1/notifications/team/:teamId`
- `PUT /api/v1/notifications/:id`
- `GET /api/v1/activity/team/:teamId`

