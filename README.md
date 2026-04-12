# E-Commerce Logs API

A production-grade backend starter for an e-commerce API demonstrating advanced structured logging, clean architecture, and robust enterprise patterns.

## Features Used

- **Express & TypeScript**: Strongly typed modern API.
- **Structured Logging (Pino)**: Deep contextual logging via request IDs, HTTP logs, DB query logs, slow query logs, security logs, and business audit trails.
- **PostgreSQL Database**: Configured connection pool with parameterized query runners and managed transactions.
- **Security**: Helmet, CORS, and Express-Rate-Limit with security threshold event logging.
- **Clean Architecture Modularity**: Code separated by domains (auth, users, products, categories, carts, orders, payments, admin, inventory).
- **Graceful Shutdown**: Intercepts SIGTERM/SIGINT and closes HTTP listeners and DB pools safely.

## Prerequisites

- Node.js (v20+)
- Docker and Docker Compose

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env as required if changing defaults
   ```

3. **Start PostgreSQL via Docker**
   ```bash
   docker-compose up -d
   ```

4. **Run the API (Development Mode)**
   ```bash
   npm run dev
   ```
   *Note: This mode runs Pino with `pino-pretty` to output colorful CLI logs.*

## Logging Strategy

See `docs/logging-strategy.md` for full details on how the logging engine isolates noise from actionable metrics, handles contextual tagging, and masks sensitive payloads safely.

## Project Structure

- `src/core/`: Utilities, errors, logging infrastructure, and constants.
- `src/infrastructure/`: Low-level integrations (database pools, global security config, http loggers).
- `src/modules/`: Domain entities.
- `src/middlewares/`: Express interceptors.
- `src/routes/`: Global router index definition mapping endpoints to modular controllers.
