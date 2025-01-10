export interface Vacancy {
  id: string;
  hiringLimit: number;
}

export interface Candidate {
  id: string;
  vacancyId: string;
  moduleScores: (number | 'X')[];
}

export interface ProcessedCandidate {
  vacancyId: string;
  candidateId: string;
  overallScore: number;
  submissionOrder: number;
}

export interface MatchingResult {
  vacancyId: string;
  candidateId: string;
  overallScore: number;
}
