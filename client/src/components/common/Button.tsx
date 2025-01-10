import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive';
    children: React.ReactNode;
}

export function Button({ 
    variant = 'default', 
    disabled, 
    className = '', 
    children, 
    ...props 
}: ButtonProps) {
    const variantClass = variant === 'destructive' ? 'button-destructive' : 'button-default';
    
    return (
        <button 
            className={`button ${variantClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}