# Nest.js Project

This is a Nest.js project that you can run on your local development server. Follow the steps below to get started.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (v6 or higher recommended)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <https://github.com/kawojue/b2b.git>
   cd <b2b>

2. **Environment Variables:**
  
  ```bash
  DATABASE_URI=
  JWT_SECRET=
  BITNOT_API_KEY=
  BITNOB_WEBHOOK_SECRET=

3. **Prisma**

  ```bash
  npx prisma migrate dev --name <migration_name>

4. **Running the Application**
  ```bash
  npm run start:dev

5. **Accessing Your Application**
  Your application should be accessible at http://localhost:3001

6. **Testing**
  Documentation: http://localhost:3001/docs
