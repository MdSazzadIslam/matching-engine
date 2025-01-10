import React from 'react';
import './Alert.css';

interface AlertProps {
    variant?: 'default' | 'destructive';
    children: React.ReactNode;
    className?: string;
}

export function Alert({ variant = 'default', children, className = '' }: AlertProps) {
    const variantClass = variant === 'destructive' ? 'alert-destructive' : 'alert-default';
    
    return (
        <div 
            role="alert" 
            className={`alert ${variantClass} ${className}`}
        >
            {children}
        </div>
    );
}

interface AlertTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function AlertTitle({ children, className = '' }: AlertTitleProps) {
    return (
        <h5 className={`alert-title ${className}`}>
            {children}
        </h5>
    );
}

interface AlertDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
    return (
        <div className={`alert-description ${className}`}>
            {children}
        </div>
    );
}