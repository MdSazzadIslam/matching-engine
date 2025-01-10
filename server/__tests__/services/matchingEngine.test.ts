import { MatchingEngine } from "../../src/services/matchingEngine";
import { MatchingResult } from "../../src/types";

describe('MatchingEngine', () => {
  let matchingEngine: MatchingEngine;

  // Valid 24-character hex IDs
  const V1 = '507f1f77bcf86cd799439011';
  const V2 = '507f1f77bcf86cd799439012';
  const C1 = '607f1f77bcf86cd799439013';
  const C2 = '607f1f77bcf86cd799439014';
  const C3 = '607f1f77bcf86cd799439015';
  const C4 = '607f1f77bcf86cd799439016';

  beforeEach(() => {
    matchingEngine = new MatchingEngine();
  });

  describe('process', () => {
    it('should successfully process valid input', () => {
      const input = `VacancyId,HiringLimit
${V1},2
${V2},1
=
VacancyId,CandidateId,Module1,Module2,Module3
${V1},${C1},75,80,85
${V1},${C2},90,85,95
${V1},${C3},70,75,80
${V2},${C4},85,90,95`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(3); // 2 from V1 and 1 from V2
      
      // Check V1 results (should select C2 and C1 due to higher scores)
      const v1Results = result.filter(r => r.vacancyId === V1);
      expect(v1Results).toHaveLength(2);
      expect(v1Results[0]).toEqual({
        vacancyId: V1,
        candidateId: C2,
        overallScore: 90 // (90+85+95)/3
      });
      expect(v1Results[1]).toEqual({
        vacancyId: V1,
        candidateId: C1,
        overallScore: 80 // (75+80+85)/3
      });

      // Check V2 results (should select C4)
      const v2Results = result.filter(r => r.vacancyId === V2);
      expect(v2Results).toHaveLength(1);
      expect(v2Results[0]).toEqual({
        vacancyId: V2,
        candidateId: C4,
        overallScore: 90 // (85+90+95)/3
      });
    });

    it('should handle X scores correctly', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1,Module2
${V1},${C1},80,X
${V1},${C2},70,70`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        vacancyId: V1,
        candidateId: C1,
        overallScore: 80 // Only Module1 score is considered
      });
    });

    it('should respect submission order for equal scores', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1
${V1},${C1},80
${V1},${C2},80`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        vacancyId: V1,
        candidateId: C1,
        overallScore: 80
      });
    });

    it('should throw error for invalid vacancy format', () => {
      const input = `VacancyId,HiringLimit
${V1},invalid
=
VacancyId,CandidateId,Module1
${V1},${C1},80`;

      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should throw error for invalid module score', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1
${V1},${C1},101`;

      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should throw error for missing vacancy reference', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1
${V2},${C1},80`;

      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should handle minimum valid scores', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1
${V1},${C1},0`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        vacancyId: V1,
        candidateId: C1,
        overallScore: 0
      });
    });

    it('should handle maximum valid scores', () => {
      const input = `VacancyId,HiringLimit
${V1},1
=
VacancyId,CandidateId,Module1
${V1},${C1},100`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        vacancyId: V1,
        candidateId: C1,
        overallScore: 100
      });
    });

    it('should handle large hiring limits', () => {
      const input = `VacancyId,HiringLimit
${V1},999999
=
VacancyId,CandidateId,Module1
${V1},${C1},80`;

      const result = matchingEngine.process(input);
      
      expect(result).toHaveLength(1);
    });

    it('should throw error for invalid file format', () => {
      const input = 'Invalid format without separator';
      
      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should throw error for empty sections', () => {
      const input = '=';
      
      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should throw error for missing headers', () => {
      const input = `${V1},1
=
${V1},${C1},80`;

      expect(() => matchingEngine.process(input)).toThrow();
    });

    it('should throw error for invalid ID format', () => {
      const input = `VacancyId,HiringLimit
invalid_id,1
=
VacancyId,CandidateId,Module1
invalid_id,${C1},80`;

      expect(() => matchingEngine.process(input)).toThrow();
    });
  });
});