import express from 'express';
import cors from 'cors';
import { env, logger } from '../utils';
import { connectDB } from '../db/client';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
});

// Routes
app.use('/api/v1', routes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'EV Charging API server started');
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
