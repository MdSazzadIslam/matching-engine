import { Router } from 'express';
import multer from 'multer';
import { MatchingController } from '../controllers/matchingController';

export const matchingRoutes = (router: Router): void => {
  const matchingController = new MatchingController();
  const upload = multer();

  router.post(
    '/matching/calculate',
    upload.single('file'),
    // Bind the method to ensure 'this' context is preserved
    (req, res) => matchingController.calculate(req, res),
  );
};
