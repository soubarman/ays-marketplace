import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    border: '1px solid transparent',
    letterSpacing: '-0.01em',
    ...style
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary)', color: 'white', boxShadow: '0 4px 14px 0 rgba(15, 23, 42, 0.2)' },
    secondary: { backgroundColor: 'var(--color-accent)', color: 'white', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)' },
    outline: { backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)', boxShadow: 'var(--shadow-sm)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--color-text-main)' },
    white: { backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)' }
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '0.375rem 0.875rem', fontSize: '0.875rem', height: '36px' },
    md: { padding: '0.5rem 1.25rem', fontSize: '0.9375rem', height: '48px' },
    lg: { padding: '0.75rem 1.75rem', fontSize: '1.0625rem', height: '56px' },
    xl: { padding: '1rem 2rem', fontSize: '1.125rem', height: '64px' }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
      }}
      className={className}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
        if(variant === 'primary') e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(15, 23, 42, 0.2)';
        if(variant === 'secondary') e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.3)';
        if(variant === 'white') e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
        if(variant === 'outline') e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        if(variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
        if(variant === 'primary' || variant === 'secondary' || variant === 'white') e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        if(variant === 'outline') e.currentTarget.style.backgroundColor = 'var(--color-background)';
        if(variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--color-border)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
