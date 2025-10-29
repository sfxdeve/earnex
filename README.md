# earnex

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Express, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Express** - Fast, unopinionated web framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Node.js** - Runtime environment
- **Prisma** - TypeScript-first ORM
- **MongoDB** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses MongoDB with Prisma ORM.

1. Make sure you have MongoDB set up.
2. Update your `apps/server/.env` file with your MongoDB connection URI.

3. Generate the Prisma client and push the schema:
```bash
pnpm db:push
```


Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).







## Project Structure

```
earnex/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Express, ORPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI
- `pnpm check`: Run Biome formatting and linting
