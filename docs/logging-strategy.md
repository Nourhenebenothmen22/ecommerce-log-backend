# Logging Strategy - E-Commerce API

This document describes the structured logging strategy implemented in this application. 

The strategy ensures we have full observability in production while maintaining readable logs during development. We use [`pino`](https://getpino.io) as our central logger.

## 1. Request Context & Sizing

Every incoming HTTP request is assigned a unique `requestId` (UUID v4) via the `requestContextMiddleware`. 
A child logger (`req.log`) is scoped to this request, ensuring all subsequent logs within the request lifecycle implicitly contain:
- `requestId`
- `method`
- `url`

## 2. Categories of Logs

### HTTP Request Logs
Provided automatically by `pino-http` in `requestLoggerMiddleware`.
- **Level**: `INFO` for 2xx/3xx, `WARN` for 4xx, `ERROR` for 5xx.
- **Fields embedded**: `req` (scrubbed headers, IP, User-Agent), `res` (Status Code), `durationMs` (Response time).

### Database & SQL Logs
- **Location**: `infrastructure/database/`
- **Fields**: Pool lifecycle events (connect, error, acquire). Query text, parameters (sanitized), and `durationMs`.
- **Feature**: Slow queries taking over `SLOW_QUERY_THRESHOLD_MS` are logged as `WARN`.
- **Transactions**: Explicit logs for `BEGIN`, `COMMIT`, and `ROLLBACK` durations.

### Security Logs
- **Location**: `infrastructure/security/security-logger.ts`
- **Categories**: `rate_limit_exceeded`, `unauthorized_access`, `invalid_token`, `admin_route_denied`, etc.
- **Usage**: Critical for tracing abuse and intrusion attempts.

### Audit Logs
- **Location**: `middlewares/audit.middleware.ts`
- **Purpose**: Log critical business/admin events (e.g., manual stock adjustment, order refunds).
- **Fields**: `userId`, `action`, `resource`, `resourceId`, and domain `details`.

### Business & Error Logs
- Handled at the Service layer (e.g., `Order created`, `Stock adjusted`).
- Errors are centrally captured in `errorHandlerMiddleware`, serializing stack traces (in development only) alongside the `requestId`.

## 3. Security & Redaction

- Log output is sanitized to prevent leaking PII or credentials. 
- `pino` is configured with `redact` to strip: `authorization`, `cookie`, `password`, `token`, `secret`.
- SQL arrays containing long strings (which could be JWTs) are truncated by the `sanitizeParams` utility.
