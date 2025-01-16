# Talent Matching Engine Client

A React-based frontend application for uploading candidate data and displaying matching results.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Features](#features)
- [Components](#components)
- [Testing](#testing)
- [Configuration](#configuration)

## Overview

This is the frontend application for the Talent Matching Engine. It provides a user interface for uploading candidate files and displaying match results between candidates and vacancies.

## Project Structure

```
├── node_modules/       # Dependencies
├── public/            # Static assets
├── src/               # Source code
│   ├── api/           # API integration
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   ├── app.styles.css # Global styles
│   └── index.tsx      # Application entry point
├── test/              # Test files
├── .babelrc          # Babel configuration
├── .env              # Environment variables
├── global.d.ts       # Global type declarations
├── jest.config.js    # Jest testing configuration
├── jest.setup.ts     # Jest setup file
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── webpack.config.js # Webpack configuration
```

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure the backend API endpoint in `.env`:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Development

Start the development server:
```bash
npm run start
```

Build for production:
```bash
npm run build
```

Run linting:
```bash
npm run lint
```

## Features

### File Upload
- Support for text file uploads (.txt)
- File validation
- Upload progress indication
- Error handling and user feedback

### Results Display
- Tabular view of matching results
- Sorting capabilities
- Score visualization
- Export functionality

## Components

### Core Components
- `FileUpload`: Handles file selection and upload
- `MatchResults`: Displays matching results
- `ResultsTable`: Tabular display of matches
- `ErrorBoundary`: Global error handling
- `LoadingSpinner`: Loading state indication

### Custom Hooks
- `useFileUpload`: Manages file upload state and logic
- `useMatchResults`: Handles matching results data
- `useErrorHandler`: Centralizes error handling

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode for development:
```bash
npm run test:watch
```

### Testing Stack
- Jest for test running and assertions
- Testing Library for component testing
- MSW for API mocking

## Configuration

### Environment Variables

```env
REACT_APP_API_URL=      # Backend API URL
REACT_APP_MAX_FILE_SIZE= # Maximum file size in bytes
REACT_APP_ENVIRONMENT=   # development/production
```

### TypeScript Configuration

Key TypeScript configurations in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

### Webpack Configuration

The application uses a custom webpack configuration for:
- TypeScript compilation
- CSS processing
- Asset handling
- Development server
- Production optimization

## File Formats

### Input File Requirements
- Text file (.txt)
- Two sections separated by "="
- First section: Vacancy information
- Second section: Candidate data
- Proper formatting as per specification:

```
VacancyId,HiringLimit
[24-char-hex-id],2

=
VacancyId,CandidateId,Module1,Module2,Module3
[24-char-hex-id],[24-char-hex-id],80,90,85
```

### Output Format
```
VacancyId,CandidateId,Overall Score
[24-char-hex-id],[24-char-hex-id],85
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines
- Follow React best practices
- Write tests for new features
- Document components and hooks
- Follow existing code style
- Use TypeScript for type safety

## License

This project is proprietary under MIT.