import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: '0.75rem 1.25rem',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-main)',
          fontSize: '1rem',
          outline: 'none',
          fontWeight: 500,
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        className={className}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-accent)';
          e.currentTarget.style.boxShadow = `0 0 0 4px ${error ? 'rgba(239,68,68,0.15)' : 'rgba(37,99,235,0.15)'}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-error)', fontWeight: 500, marginTop: '0.25rem' }}>{error}</span>
      )}
    </div>
  );
};

export default Input;
