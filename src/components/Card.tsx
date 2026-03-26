import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} {...props}>
      {children}
    </div>
  );
};

export default Card;
