import React from 'react';
import { render } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { container } = render(<Card>Card Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveTextContent('Card Content');
  });

  it('applies base card class', () => {
    const { container } = render(<Card>Card Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card');
  });

  it('applies additional className when provided', () => {
    const { container } = render(<Card className="custom-class">Card Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('custom-class');
  });
});

describe('CardHeader Component', () => {
  it('renders children correctly', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveTextContent('Header Content');
  });

  it('applies base header class', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('card-header');
  });

  it('applies additional className when provided', () => {
    const { container } = render(<CardHeader className="custom-header">Header Content</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('card-header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle Component', () => {
  it('renders children correctly', () => {
    const { container } = render(<CardTitle>Title Content</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveTextContent('Title Content');
  });

  it('renders as h3 element', () => {
    const { container } = render(<CardTitle>Title Content</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title.tagName).toBe('H3');
  });

  it('applies base title class', () => {
    const { container } = render(<CardTitle>Title Content</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('card-title');
  });

  it('applies additional className when provided', () => {
    const { container } = render(<CardTitle className="custom-title">Title Content</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('card-title');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardContent Component', () => {
  it('renders children correctly', () => {
    const { container } = render(<CardContent>Main Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveTextContent('Main Content');
  });

  it('applies base content class', () => {
    const { container } = render(<CardContent>Main Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('card-content');
  });

  it('applies additional className when provided', () => {
    const { container } = render(<CardContent className="custom-content">Main Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('card-content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('Card Component Integration', () => {
  it('renders full card structure correctly', () => {
    const { container } = render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Card Title</CardTitle>
        </CardHeader>
        <CardContent className="custom-content">
          Card Content
        </CardContent>
      </Card>
    );

    // Test Card
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('custom-card');

    // Test CardHeader
    const header = card.firstChild as HTMLElement;
    expect(header).toHaveClass('card-header');
    expect(header).toHaveClass('custom-header');

    // Test CardTitle
    const title = header.firstChild as HTMLElement;
    expect(title).toHaveClass('card-title');
    expect(title).toHaveClass('custom-title');

    // Test CardContent
    const content = card.lastChild as HTMLElement;
    expect(content).toHaveClass('card-content');
    expect(content).toHaveClass('custom-content');
  });
});