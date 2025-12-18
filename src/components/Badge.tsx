import clsx from 'clsx';
import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info';

type Props = {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
};

export const Badge: React.FC<Props> = ({ tone = 'info', children, className }) => {
  return (
    <span className={clsx('tag', tone, className)} role="status">
      {children}
    </span>
  );
};
