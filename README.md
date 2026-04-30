# Team Task Manager

A full-stack web application for managing team projects and tracking tasks. Built with Next.js, Prisma, PostgreSQL, and NextAuth.

## 🚀 Features

- **Authentication & Authorization**: Secure login and registration with hashed passwords using NextAuth and bcrypt.
- **Role-Based Access Control**: 
  - `ADMIN`: Can create projects, generate team join codes, and assign tasks to members.
  - `MEMBER`: Can join projects using team codes and update the status of tasks specifically assigned to them.
- **Team Join Codes**: Securely join private team projects using a unique 6-character code.
- **Task Management Board**: Visual dashboard to track task statuses (To Do, In Progress, Done).
- **Responsive UI**: Built with custom Vanilla CSS featuring dark-mode aesthetics, glassmorphism, and seamless interactions.

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React, Vanilla CSS
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4 (Credentials Provider)

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd team-task-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name"
   NEXTAUTH_SECRET="generate_a_random_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   Push the Prisma schema to your PostgreSQL database to create the necessary tables.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
