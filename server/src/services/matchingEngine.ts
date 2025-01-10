import {
  Candidate,
  MatchingResult,
  ProcessedCandidate,
  Vacancy,
} from '../types';
import logger from '../utils/logger';
import { Validators } from '../utils/validators';

export class MatchingEngine {
  private parseInput(input: string): {
    vacancies: Map<string, Vacancy>;
    candidates: Candidate[];
  } {
    // This line is splitting the input string into two sections based on the "=" delimiter.
    const sections = input.trim().split('=');
    if (sections.length !== 2) {
      logger.error(
        'Invalid file format: File must contain two sections separated by "="',
      );
      throw new Error(
        'Invalid file format: File must contain two sections separated by "="',
      );
    }

    // This line is using destructuring to assign the trimmed versions of the two sections to the variables vacanciesSection and candidatesSection.
    // The map method is used to apply the trim method to each section, removing any leading or trailing whitespace from the strings.
    // The result is an array of trimmed strings, which is then destructured into the two variables.
    const [vacanciesSection, candidatesSection] = sections.map((section) =>
      section.trim(),
    );

    // Parse vacancies
    const vacancies = new Map<string, Vacancy>();

    const vacancyLines = vacanciesSection.split('\n');

    if (vacancyLines.length < 2) {
      logger.error(
        'Invalid vacancy section: Must contain header and at least one vacancy',
      );
      throw new Error(
        'Invalid vacancy section: Must contain header and at least one vacancy',
      );
    }

    // Skip the header row and process each vacancy line
    vacancyLines.slice(1).forEach((line) => {
      // Split the line into ID and hiring limit using comma as delimiter
      const [id, hiringLimit] = line.split(',');
      // Validate that both ID and hiring limit are present
      if (!id || !hiringLimit) {
        logger.error(
          'Invalid vacancy format: Each line must contain ID and hiring limit',
        );
        throw new Error(
          'Invalid vacancy format: Each line must contain ID and hiring limit',
        );
      }

      // Validate ID
      const idValidation = Validators.validateObjectId(id);
      if (!idValidation.isValid) {
        logger.error(idValidation.error);
        throw new Error(idValidation.error);
      }

      // Convert hiring limit string to integer (base 10)
      const limit = parseInt(hiringLimit, 10);
      // Validate that the limit is a valid number less than 1,000,000
      if (isNaN(limit) || limit >= 1000000) {
        logger.error(
          'Invalid hiring limit: Must be a number less than 1,000,000',
        );
        throw new Error(
          'Invalid hiring limit: Must be a number less than 1,000,000',
        );
      }
      // Add the vacancy to the Map with ID as key and an object containing ID and hiring limit as value
      vacancies.set(id, {
        id,
        hiringLimit: limit,
      });
    });

    // Initialize array to store parsed candidates
    const candidates: Candidate[] = [];
    const candidateLines = candidatesSection.split('\n');

    // Ensure there's a header row and at least one candidate
    if (candidateLines.length < 2) {
      logger.error(
        'Invalid candidates section: Must contain header and at least one candidate',
      );
      throw new Error(
        'Invalid candidates section: Must contain header and at least one candidate',
      );
    }

    // Calculate number of modules from header row
    // Format: VacancyId,CandidateId,Module1,Module2,...
    const moduleCount = candidateLines[0].split(',').length - 2; // Subtract VacancyId and CandidateId

    // Process each candidate line (skipping header)
    candidateLines.slice(1).forEach((line) => {
      // Split line into parts using comma delimiter
      const parts = line.split(',');
      // Verify the line has correct number of fields (VacancyId + CandidateId + modules)
      if (parts.length !== moduleCount + 2) {
        logger.error(
          'Invalid candidate format: Inconsistent number of modules',
        );
        throw new Error(
          'Invalid candidate format: Inconsistent number of modules',
        );
      }

      // Destructure parts into vacancyId, candidateId, and remaining module scores
      const [vacancyId, candidateId, ...moduleScores] = parts;

      // Validate IDs
      const vacancyIdValidation = Validators.validateObjectId(vacancyId);
      if (!vacancyIdValidation.isValid) {
        logger.error(vacancyIdValidation.error);
        throw new Error(vacancyIdValidation.error);
      }

      // Verify the referenced vacancy exists
      if (!vacancies.has(vacancyId)) {
        logger.error(
          `Invalid vacancy reference: ${vacancyId} not found in vacancies section`,
        );
        throw new Error(
          `Invalid vacancy reference: ${vacancyId} not found in vacancies section`,
        );
      }
      // Add candidate to array with parsed and validated data
      candidates.push({
        id: candidateId,
        vacancyId,
        moduleScores: moduleScores.map((score) => {
          // Handle 'X' scores (indicating module not taken)
          if (score.trim() === 'X') return 'X';
          // Convert score to number and validate range
          const numScore = parseFloat(score);
          if (isNaN(numScore) || numScore < 0 || numScore > 100) {
            logger.error(
              `Invalid module score: ${score} - must be between 0 and 100 or 'X'`,
            );
            throw new Error(
              `Invalid module score: ${score} - must be between 0 and 100 or 'X'`,
            );
          }
          return numScore;
        }),
      });
    });

    // Return both parsed vacancies and candidates
    return { vacancies, candidates };
  }

  private calculateOverallScore(moduleScores: (number | 'X')[]): number {
    // This function calculates the overall score for a candidate based on their module scores.
    // It filters out any 'X' scores (indicating a module not taken) and calculates the average of the remaining scores.
    // If there are no valid scores, it returns 0.
    const validScores = moduleScores.filter(
      (score): score is number => score !== 'X',
    );
    if (validScores.length === 0) return 0;

    const sum = validScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / validScores.length);
  }

  private selectTopCandidates(
    candidates: ProcessedCandidate[],
    hiringLimit: number,
  ): ProcessedCandidate[] {
    // This function sorts the candidates based on their overall score in descending order and their submission order in ascending order.
    // It then returns the top candidates up to the hiring limit specified.
    return candidates
      .sort((a, b) => {
        if (b.overallScore !== a.overallScore) {
          return b.overallScore - a.overallScore;
        }
        return a.submissionOrder - b.submissionOrder;
      })
      .slice(0, hiringLimit);
  }

  public process(fileContent: string): MatchingResult[] {
    try {
      logger.info('Parsing input file');
      const { vacancies, candidates } = this.parseInput(fileContent);

      // This piece of code maps each candidate to a new object with the following properties:
      // - vacancyId: the id of the vacancy the candidate is applying for
      // - candidateId: the id of the candidate
      // - overallScore: the overall score of the candidate, calculated based on their module scores
      // - submissionOrder: the order in which the candidate's application was submitted
      const processedCandidates: ProcessedCandidate[] = candidates.map(
        (candidate, index) => ({
          vacancyId: candidate.vacancyId,
          candidateId: candidate.id,
          overallScore: this.calculateOverallScore(candidate.moduleScores),
          submissionOrder: index,
        }),
      );

      const candidatesByVacancy = new Map<string, ProcessedCandidate[]>();
      processedCandidates.forEach((candidate) => {
        const existingCandidates =
          candidatesByVacancy.get(candidate.vacancyId) || [];
        candidatesByVacancy.set(candidate.vacancyId, [
          ...existingCandidates,
          candidate,
        ]);
      });

      // This section of the code iterates through each vacancy and its corresponding candidates.
      // For each vacancy, it selects the top candidates based on their overall score and submission order.
      // The selected candidates are then added to the results array, which will be returned as the final matching result.
      // The results array contains the vacancy ID, candidate ID, and overall score for each selected candidate.
      const results: MatchingResult[] = [];
      candidatesByVacancy.forEach((vacancyCandidates, vacancyId) => {
        const vacancy = vacancies.get(vacancyId);
        if (vacancy) {
          const selectedCandidates = this.selectTopCandidates(
            vacancyCandidates,
            vacancy.hiringLimit,
          );

          results.push(
            ...selectedCandidates.map(
              ({ vacancyId, candidateId, overallScore }) => ({
                vacancyId,
                candidateId,
                overallScore,
              }),
            ),
          );
        }
      });

      return results;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to process matching: ${error.message}`);
        throw new Error(`Failed to process matching: ${error.message}`);
      } else {
        logger.error('An unknown error occurred');
        throw new Error('An unknown error occurred');
      }
    }
  }
}
