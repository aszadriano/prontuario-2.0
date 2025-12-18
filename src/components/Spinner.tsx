import React from 'react';

type Props = { size?: number };

export const Spinner: React.FC<Props> = ({ size = 20 }) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      border: '2px solid rgba(0,0,0,0.1)',
      borderTopColor: 'var(--color-primary-strong)',
      animation: 'spin 1s linear infinite',
    }}
  />
);
