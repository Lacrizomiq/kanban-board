# kanban-board

A small Kanban board where users can create project, add tasks to a list and manage them.

## Features

- User authentication
- User registration
- Board creation
- List creation
- Task creation
- Assign a tag to a task
- Move a task to another list
- delete a task
- update a task
- delete a list
- update a list
- delete a board
- update a board

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Prerequisites

- Node.js
- Prisma
- PostgreSQL
- Docker
- Docker Compose
- Tailwind CSS
- Prisma
- Zod
- bcryptjs

### Installation

1. Clone the repository

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```bash
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/kanban_board
   ```

4. Run the migrations

   ```bash
   npx prisma migrate dev
   ```

5. Start the application

   ```bash
   npm run dev
   ```
