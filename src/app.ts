import express from 'express';
import { requestContextMiddleware } from './middlewares/request-context.middleware.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { createHelmetMiddleware } from './infrastructure/security/helmet.js';
import { createCorsMiddleware } from './infrastructure/security/cors.js';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { apiRoutes } from './routes/index.js';

const app = express();

app.use(createHelmetMiddleware());
app.use(createCorsMiddleware());
app.use(rateLimitMiddleware); // Apply globally
app.use(express.json());

// Inject context and pino-http logger
app.use(requestContextMiddleware);
app.use(requestLoggerMiddleware);

// Mount all routes
app.use(apiRoutes);

// Catch-all and centralized error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
