import { Router } from 'express';
import { pool } from '../infrastructure/database/pg.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

export { router as healthRoutes };
