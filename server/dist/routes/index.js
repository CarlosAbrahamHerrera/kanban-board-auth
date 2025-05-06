import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
// Public routes for authentication
console.log('Mounting auth routes at /');
router.use('/', authRoutes);
// Protected API routes - require authentication
console.log('Mounting protected API routes at /api with auth middleware');
router.use('/api', authMiddleware, apiRoutes);
export default router;
