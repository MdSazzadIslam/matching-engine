# Harver Matching Engine Backend

A TypeScript-based backend service that processes candidate applications and matches them with vacancies based on module scores.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Input/Output Format](#inputoutput-format)
- [Testing](#testing)
- [Technical Details](#technical-details)

## Overview

The matching engine is a backend service that finds the best candidates for vacancies based on their module scores. It processes input files containing vacancy details and candidate applications, calculating overall scores and matching candidates according to specified hiring limits.

## Features

- File upload and processing
- Candidate-vacancy matching algorithm
- Module score calculation
- Support for variable module counts per vacancy
- Validation of ObjectId formats
- Error handling and logging
- Unit testing coverage

## Project Structure

```
src/
├── config/             # Configuration settings
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── routes/            # API routes
├── services/          # Business logic
│   └── matchingEngine.ts
├── types/             # TypeScript interfaces
├── utils/             # Utilities and helpers
│   ├── logger.ts
│   └── validators.ts
└── server.ts          # Entry point
```

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- TypeScript (v4.x or higher)

## Installation

1. Clone the repository:
```bash
git clone 
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Build the project:
```bash
npm run build
```

## Development

Start the development server:
```bash
npm run dev
```

Run linting:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Input/Output Format

### Input File Format

The input file should contain two sections separated by "=" sign:

```
VacancyId,HiringLimit
5c0e2314a1c9e9714fe3b2f2,2

=
VacancyId,CandidateId,Module1,Module2,Module3,Module4,Module5
5c0e2314a1c9e9714fe3b2f2,5bffe0fb3a8d783e648f8fdd,30,24.5,X,X
```

### Output Format

The output will be in the following format:

```
VacancyId,CandidateId,Overall Score
5c0e2314a1c9e9714fe3b2f2,5c069d933a8d783e64907809,52
```

### Constraints

- CandidateId and VacancyId must be in MongoDB ObjectId format (24-character hex string)
- Module scores range from 0 to 100 with maximum 2 decimal points
- Each vacancy can have a different number of modules
- Hiring limit must be below 1,000,000
- 'X' indicates a module that doesn't belong to the vacancy

## Technical Details

### Score Calculation

- Overall score is the rounded average of non-"X" module scores
- Candidates are ranked by overall score
- For equal scores, earlier applications take precedence

### Data Validation

The system validates:
- File format and content
- ObjectId formats
- Score ranges and decimal places
- Hiring limits
- Module count consistency

### Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Malformed IDs
- Invalid score ranges
- Missing or corrupted data
- File size limits

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Files
- `matchingEngine.test.ts`: Core matching logic tests
- `validators.test.ts`: Input validation tests
- `fileUpload.test.ts`: File processing tests

## API Documentation

### POST /api/match

Processes candidate applications and returns matches.

Request:
- Method: POST
- Content-Type: multipart/form-data
- Body: File upload (text/plain)

Response:
```json
{
  "matches": [
    {
      "vacancyId": "5c0e2314a1c9e9714fe3b2f2",
      "candidateId": "5c069d933a8d783e64907809",
      "overallScore": 52
    }
  ]
}
```

Error Responses:
- 400: Invalid file format or content
- 422: Invalid data in file
- 500: Server error

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage
- Document new features
- Follow the existing code style

## License

This project is proprietary software for Harver.