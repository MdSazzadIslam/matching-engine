import React from 'react';
import { render, screen } from '@testing-library/react';
import { UploadButton } from './index';

// Mock the Button component
jest.mock('../../common/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe('UploadButton Component', () => {
  it('renders in default state', () => {
    render(
      <UploadButton 
        isDisabled={false}
        isLoading={false}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('upload-button');
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(document.querySelector('.upload-icon')).toBeInTheDocument();
  });

  it('renders in loading state', () => {
    render(
      <UploadButton 
        isDisabled={false}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
    expect(document.querySelector('.loading-container')).toBeInTheDocument();
    expect(document.querySelector('.upload-icon')).not.toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    render(
      <UploadButton 
        isDisabled={true}
        isLoading={false}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders in disabled and loading state', () => {
    render(
      <UploadButton 
        isDisabled={true}
        isLoading={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('applies custom class to button', () => {
    render(
      <UploadButton 
        isDisabled={false}
        isLoading={false}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('upload-button');
  });

  it('shows correct content based on loading state', () => {
    const { rerender } = render(
      <UploadButton 
        isDisabled={false}
        isLoading={false}
      />
    );
    
    // Initial state
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(document.querySelector('.upload-icon')).toBeInTheDocument();
    expect(document.querySelector('.spinner')).not.toBeInTheDocument();
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();

    // Rerender with loading true
    rerender(
      <UploadButton 
        isDisabled={false}
        isLoading={true}
      />
    );

    expect(screen.queryByText('Upload')).not.toBeInTheDocument();
    expect(document.querySelector('.upload-icon')).not.toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});