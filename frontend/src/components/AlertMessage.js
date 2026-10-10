import React from 'react';

const AlertMessage = ({ variant = 'danger', message, onClose }) => {
  if (!message) return null;

  const iconClass =
    variant === 'success'
      ? 'bi-check-circle-fill text-success'
      : variant === 'warning'
      ? 'bi-exclamation-triangle-fill text-warning'
      : 'bi-exclamation-octagon-fill text-danger';

  return (
    <div className={`alert alert-${variant} alert-dismissible fade show d-flex align-items-center mb-4`} role="alert">
      <i className={`bi ${iconClass} fs-5 me-2`}></i>
      <div className="flex-grow-1 small">{message}</div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
