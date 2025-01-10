import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './index';
import { useFileUpload } from '../../../hooks/useFileUpload';

// Mock the custom hook
jest.mock('../../../hooks/useFileUpload');

// Mock child components
jest.mock('../../common/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

jest.mock('../../ResultsDisplay', () => ({
  ResultsDisplay: ({ results }: { results: any }) => (
    <div data-testid="results-display">{JSON.stringify(results)}</div>
  ),
}));

jest.mock('../UploadArea', () => ({
  UploadArea: ({
    file,
    isDragging,
    onFileChange,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
  }: any) => (
    <div
      data-testid="upload-area"
      data-is-dragging={isDragging}
      data-has-file={!!file}
      onChange={onFileChange}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  ),
}));

jest.mock('../UploadButton', () => ({
  UploadButton: ({ isDisabled, isLoading }: any) => (
    <button
      data-testid="upload-button"
      disabled={isDisabled}
      data-is-loading={isLoading}
    >
      Upload
    </button>
  ),
}));

describe('FileUpload Component', () => {
  const mockUseFileUpload = useFileUpload as jest.MockedFunction<typeof useFileUpload>;

  const defaultMockHookReturn = {
    file: null,
    results: null,
    error: null,
    loading: false,
    isDragging: false,
    uploadProgress: 0,
    handleFileChange: jest.fn(),
    handleDragEnter: jest.fn(),
    handleDragLeave: jest.fn(),
    handleDragOver: jest.fn(),
    handleDrop: jest.fn(),
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFileUpload.mockReturnValue(defaultMockHookReturn);
  });

  it('renders initial state correctly', () => {
    render(<FileUpload />);
    
    expect(screen.getByText('Upload the input file')).toBeInTheDocument();
    expect(screen.getByTestId('upload-area')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toBeDisabled();
  });

  it('enables upload button when file is selected', () => {
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      file: new File([''], 'test.csv'),
    });

    render(<FileUpload />);
    expect(screen.getByTestId('upload-button')).not.toBeDisabled();
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Test error message';
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      error: errorMessage,
    });

    render(<FileUpload />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows progress bar when uploading', () => {
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      loading: true,
      uploadProgress: 50,
    });

    render(<FileUpload />);
    expect(screen.getByText('Uploading: 50%')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toHaveAttribute('data-is-loading', 'true');
  });

  it('displays results when available', () => {
    const mockResults = 'test results';
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      results: mockResults,
    });

    render(<FileUpload />);
    expect(screen.getByTestId('results-display')).toHaveTextContent(mockResults);
  });

  it('handles form submission', () => {
    const mockHandleSubmit = jest.fn();
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      handleSubmit: mockHandleSubmit,
      file: new File([''], 'test.csv'),
    });

    render(<FileUpload />);
    
    const form = screen.getByTestId('upload-button').closest('form');
    fireEvent.submit(form!);
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('updates drag state correctly', () => {
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      isDragging: true,
    });

    render(<FileUpload />);
    expect(screen.getByTestId('upload-area')).toHaveAttribute('data-is-dragging', 'true');
  });

  it('disables upload button when loading', () => {
    mockUseFileUpload.mockReturnValue({
      ...defaultMockHookReturn,
      file: new File([''], 'test.csv'),
      loading: true,
    });

    render(<FileUpload />);
    expect(screen.getByTestId('upload-button')).toBeDisabled();
  });
});