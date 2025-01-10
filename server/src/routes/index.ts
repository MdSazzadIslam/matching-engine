import { Router } from 'express';
import { matchingRoutes } from './matchingRoutes';

const router = Router();

matchingRoutes(router);

export default router;
