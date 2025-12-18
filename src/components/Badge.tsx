import clsx from 'clsx';
import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info';
type Variant = 'primary' | 'secondary' | 'red' | 'green' | 'blue' | 'yellow' | 'gray' | string;

type Props = {
  tone?: Tone;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export const Badge: React.FC<Props> = ({ tone = 'info', variant, children, className }) => {
  // Se variant for fornecido, usa ele; senão usa tone
  const badgeClass = variant || tone;
  
  return (
    <span className={clsx('tag', badgeClass, className)} role="status">
      {children}
    </span>
  );
};
