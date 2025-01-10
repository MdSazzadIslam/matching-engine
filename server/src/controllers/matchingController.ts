import { Request, Response } from 'express';
import { MatchingEngine } from '../services/matchingEngine';
import { Validators } from '../utils/validators';
import logger from '../utils/logger';

export class MatchingController {
  private matchingEngine: MatchingEngine;

  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  public async calculate(req: Request, res: Response): Promise<void> {
    try {
      const validation = Validators.validateFile(req.file, req);

      if (!validation.isValid) {
        res.status(400).json({
          error: validation.error,
        });
        return;
      }

      const fileContent = req.file!.buffer.toString('utf-8');
      const results = this.matchingEngine.process(fileContent);

      res.status(200).json({
        results: results
          .map(
            (result) =>
              `${result.vacancyId},${result.candidateId},${result.overallScore}`,
          )
          .join('\n'),
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error processing matching request:', {
          error: error.message,
          method: req.method,
          url: req.url,
        });
        res.status(400).json({
          error: error.message,
        });
      } else {
        logger.error('Unknown error processing matching request:', {
          error: error,
          method: req.method,
          url: req.url,
        });
        res.status(500).json({
          error: 'An unknown error occurred',
        });
      }
    }
  }
}
