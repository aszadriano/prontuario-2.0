import clsx from 'clsx';
import React from 'react';

type Variant = 'elevated' | 'flat' | 'highlight';

type Props = {
  title?: string;
  action?: React.ReactNode;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<Props> = ({ title, action, variant = 'elevated', children, className }) => {
  return (
    <section className={clsx('card', variant === 'highlight' && 'highlight', variant === 'flat' && 'flat', className)}>
      {(title || action) && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          {title && <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
};
