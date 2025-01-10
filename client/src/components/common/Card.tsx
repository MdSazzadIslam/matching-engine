import React from 'react';
import './Card.css';

interface ComponentWithClassNameProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: ComponentWithClassNameProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: ComponentWithClassNameProps) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }: ComponentWithClassNameProps) {
  return (
    <h3 className={`card-title ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children }: ComponentWithClassNameProps) {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
}