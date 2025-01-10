import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResultsDisplay } from './ResultsDisplay';

// Mock the Card components
jest.mock('./common/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('ResultsDisplay Component', () => {
  const mockResults = `1,101,0.95
2,102,0.85
3,103,0.75`;

  it('renders the component with basic structure', () => {
    render(<ResultsDisplay results={mockResults} />);
    
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('3 records found')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Vacancy ID')).toBeInTheDocument();
    expect(screen.getByText('Candidate ID')).toBeInTheDocument();
    expect(screen.getByText('Overall Score')).toBeInTheDocument();
  });

  it('displays correct number of records', () => {
    render(<ResultsDisplay results={mockResults} />);
    
    const rows = screen.getAllByRole('row');
    // Add 1 for header row
    expect(rows).toHaveLength(4);
  });

  it('correctly parses and displays result data', () => {
    render(<ResultsDisplay results={mockResults} />);
    
    // Check first row data
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('0.95')).toBeInTheDocument();
    
    // Check second row data
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('0.85')).toBeInTheDocument();
  });

  it('handles empty results', () => {
    render(<ResultsDisplay results={''} />);
    
    expect(screen.getByText('0 records found')).toBeInTheDocument();
    expect(screen.queryAllByRole('row')).toHaveLength(1); // Only header row
  });

  it('handles results with empty lines', () => {
    const resultsWithEmptyLines = `1,101,0.95

2,102,0.85

`;
    render(<ResultsDisplay results={resultsWithEmptyLines} />);
    
    expect(screen.getByText('2 records found')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 data rows
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ResultsDisplay results={mockResults} />);
    
    expect(container.querySelector('.results-container')).toBeInTheDocument();
    expect(container.querySelector('.results-card')).toBeInTheDocument();
    expect(container.querySelector('.results-header')).toBeInTheDocument();
    expect(container.querySelector('.results-title')).toBeInTheDocument();
    expect(container.querySelector('.results-content')).toBeInTheDocument();
    expect(container.querySelector('.results-table')).toBeInTheDocument();
    expect(container.querySelector('.table-header')).toBeInTheDocument();
    expect(container.querySelector('.table-body')).toBeInTheDocument();
  });

  it('renders cell classes correctly', () => {
    const { container } = render(<ResultsDisplay results={mockResults} />);
    
    expect(container.querySelector('.vacancy-cell')).toBeInTheDocument();
    expect(container.querySelector('.candidate-cell')).toBeInTheDocument();
    expect(container.querySelector('.score-cell')).toBeInTheDocument();
  });

  it('handles malformed data gracefully', () => {
    const malformedResults = `1,101
2,102,0.85,extra
3`;
    
    render(<ResultsDisplay results={malformedResults} />);
    
    expect(screen.getByText('3 records found')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4); // Still renders all rows
  });
});