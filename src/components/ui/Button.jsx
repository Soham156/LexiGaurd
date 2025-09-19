import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-md font-semibold';
  const styles = variant === 'primary'
    ? 'bg-sky-600 text-white hover:bg-sky-700'
    : 'bg-gray-100 text-gray-800 hover:bg-gray-200';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
