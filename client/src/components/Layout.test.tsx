import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout Component', () => {
  it('renders the layout structure correctly', () => {
    render(<Layout>Test Content</Layout>);
    
    expect(document.querySelector('.layout')).toBeInTheDocument();
    expect(document.querySelector('.main')).toBeInTheDocument();
    expect(document.querySelector('.title')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<Layout>Test Content</Layout>);
    
    expect(screen.getByText('Candidate Matching Engine || Harver Assignment')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Layout>
        <div data-testid="test-child">Child Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Layout>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<Layout>Test Content</Layout>);
    
    const layoutElement = document.querySelector('.layout');
    const mainElement = document.querySelector('.main');
    const titleElement = document.querySelector('.title');
    
    expect(layoutElement).toHaveClass('layout');
    expect(mainElement).toHaveClass('main');
    expect(titleElement).toHaveClass('title');
  });
});