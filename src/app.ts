import express from 'express';
import cookieParser from 'cookie-parser';
import { requestContextMiddleware } from './middlewares/request-context.middleware.js';
import { apacheLoggerMiddleware } from './middlewares/apache-logger.middleware.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { successLoggerMiddleware } from './middlewares/success-logger.middleware.js';
import { createHelmetMiddleware } from './infrastructure/security/helmet.js';
import { createCorsMiddleware } from './infrastructure/security/cors.js';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { apiRoutes } from './routes/index.js';

const app = express();

app.use(createHelmetMiddleware());
app.use(createCorsMiddleware());
app.use(cookieParser());
app.use(rateLimitMiddleware); // Apply globally
app.use(express.json());

// Inject context and loggers
app.use(requestContextMiddleware);
app.use(apacheLoggerMiddleware);
app.use(requestLoggerMiddleware);
app.use(successLoggerMiddleware);

// Mount all routes
app.use(apiRoutes);

// Catch-all and centralized error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
