import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

describe('Alert Component', () => {
  it('renders children correctly', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Test message');
  });

  it('applies default variant class', () => {
    const { container } = render(<Alert>Test message</Alert>);
    expect(container.firstChild).toHaveClass('alert-default');
  });

  it('applies destructive variant class', () => {
    const { container } = render(<Alert variant="destructive">Test message</Alert>);
    expect(container.firstChild).toHaveClass('alert-destructive');
  });

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-class">Test message</Alert>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('combines variant and custom classes', () => {
    const { container } = render(
      <Alert variant="destructive" className="custom-class">
        Test message
      </Alert>
    );
    expect(container.firstChild).toHaveClass('alert-destructive');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('AlertTitle Component', () => {
  it('renders children correctly', () => {
    render(<AlertTitle>Test Title</AlertTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies default class', () => {
    const { container } = render(<AlertTitle>Test Title</AlertTitle>);
    expect(container.firstChild).toHaveClass('alert-title');
  });

  it('applies custom className', () => {
    const { container } = render(<AlertTitle className="custom-class">Test Title</AlertTitle>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as h5 element', () => {
    render(<AlertTitle>Test Title</AlertTitle>);
    expect(screen.getByText('Test Title').tagName).toBe('H5');
  });
});

describe('AlertDescription Component', () => {
  it('renders children correctly', () => {
    render(<AlertDescription>Test Description</AlertDescription>);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies default class', () => {
    const { container } = render(<AlertDescription>Test Description</AlertDescription>);
    expect(container.firstChild).toHaveClass('alert-description');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AlertDescription className="custom-class">Test Description</AlertDescription>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as div element', () => {
    render(<AlertDescription>Test Description</AlertDescription>);
    expect(screen.getByText('Test Description').tagName).toBe('DIV');
  });
});

describe('Alert Component Integration', () => {
  it('renders with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toContainElement(screen.getByText('Test Title'));
    expect(screen.getByRole('alert')).toContainElement(screen.getByText('Test Description'));
  });
});