import clsx from 'clsx';
import React from 'react';
import { Icon, IconName } from './Icon';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
};

export const Input: React.FC<Props> = ({
  label,
  hint,
  error,
  icon,
  className,
  containerStyle,
  inputStyle,
  style,
  ...rest
}) => {
  const describedBy = error ? `${rest.name}-error` : hint ? `${rest.name}-hint` : undefined;
  return (
    <label className="field" style={containerStyle ?? style}>
      {label && <span className="field-label">{label}</span>}
      <div className={clsx('input', error && 'has-error', icon && 'has-icon', className)}>
        {icon && (
          <span className="input-icon">
            <Icon name={icon} size={18} />
          </span>
        )}
        <input aria-describedby={describedBy} {...rest} style={inputStyle} />
      </div>
      {hint && !error && (
        <small id={`${rest.name}-hint`} className="field-hint">
          {hint}
        </small>
      )}
      {error && (
        <small id={`${rest.name}-error`} className="field-error">
          {error}
        </small>
      )}
    </label>
  );
};
