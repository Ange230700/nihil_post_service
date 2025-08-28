<!-- post\README.md -->

# Nihil Post Service

<!-- ![Nihil Logo](link-to-logo.png) -->

A **post management microservice** for the Nihil platform.
It provides APIs for creating, retrieving, updating, deleting, and paginating posts. Built with Prisma, Express, and TypeScript, the service follows clean architecture and integrates authentication hooks to support user-specific content.

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

---

## Demo

Swagger UI is available at:

```
http://localhost:3002/api/docs
```

---

## Tech Stack

**Backend:**

- [Node.js](https://nodejs.org/) (TypeScript, ESM)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) (`nihildbpost` package, MySQL)
- [Zod](https://zod.dev/) for request validation

**Security:**

- Helmet, CORS, HPP
- Rate limiting
- CSRF protection
- JWT (RS256, access/refresh support)

**Tooling:**

- Nx task runner
- Jest + Supertest + Zod for tests
- ESLint (type-aware) + Prettier
- Husky + lint-staged + commitlint
- Docker multi-stage builds
- GitHub Actions CI (MySQL service, migrations, tests)

---

## Getting Started

### Prerequisites

- Node.js (>=20.x)
- MySQL (>=8.0)
- Docker (optional)

### Installation

```bash
git clone https://github.com/Ange230700/nihil_databases.git
cd nihil_databases/post
npm install
```

---

## Running the Project

### Local Development

```bash
# Push schema to DB (force reset)
npm run prisma:db:push:force

# Apply migrations
npm run prisma:migrate:deploy

# Build and start API
npm run build && npm start
```

The service will run on [http://localhost:3002/api](http://localhost:3002/api).

### With Docker

```bash
docker build -t nihil-post .
docker run -p 3002:3000 nihil-post
```

---

## Project Structure

```
post/
├── src/
│   ├── api/            # Express API, controllers, routes, validation
│   ├── application/    # Use cases & repository interfaces
│   ├── auth/           # JWT, CSRF, cookie handling
│   ├── core/           # Domain entities
│   ├── infrastructure/ # Prisma client, repositories
│   └── tests/          # Jest + Supertest integration tests
├── scripts/            # Prisma wrapper for native engine builds
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## API Documentation

The service exposes a Swagger UI at `/api/docs` based on [`swagger.yaml`](src/api/swagger.yaml).

Main endpoints:

- `GET /posts` – List all posts (supports pagination and filtering)
- `POST /posts` – Create a new post (requires auth or explicit `userId`)
- `GET /posts/{id}` – Retrieve a post by ID
- `PUT /posts/{id}` – Update a post
- `DELETE /posts/{id}` – Soft-delete a post

---

## Testing

Run tests:

```bash
npm test
```

CI mode (serial, for pre-push hook):

```bash
npm run test:ci
```

Tests cover:

- Post CRUD operations
- Validation (Zod schemas)
- Pagination and query filters

---

## Deployment

- **Docker:** Multi-stage Dockerfile produces a small, production-ready image.
- **CI/CD:** GitHub Actions workflow provisions MySQL, runs Prisma migrations, builds, and executes tests.
- **Runtime:** Runs with `node dist/api/server.js` under a non-root user.

---

## Environment Variables

Create a `.env` file (see `.env.sample`):

```env
POST_DATABASE_URL=mysql://root:root@localhost:3306/app_db
FRONT_API_BASE_URL=http://localhost:5173
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d
PORT=3002
```

---

## Contributing

We follow **conventional commits** and enforce branch naming rules.
Husky hooks run linting, tests, and commit message validation automatically.

Steps:

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit using `npm run commit`
4. Push and open a PR

---

## License

This project is licensed under the ISC License.

<!-- ---

## Acknowledgements

* [Express](https://expressjs.com/)
* [Prisma](https://www.prisma.io/)
* [Zod](https://zod.dev/)
* [Pino](https://getpino.io/)
* [Swagger UI](https://swagger.io/tools/swagger-ui/) -->

---

## Contact

**Ange KOUAKOU**

- [Portfolio](https://ultime-portfolio.vercel.app/)
- [GitHub](https://github.com/Ange230700)
- [LinkedIn](https://www.linkedin.com/in/ange-kouakou/)
