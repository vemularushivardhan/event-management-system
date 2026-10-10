import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const colorMap = {
    primary: { bg: '#eff6ff', text: '#2563eb' },
    success: { bg: '#ecfdf5', text: '#10b981' },
    warning: { bg: '#fffbeb', text: '#f59e0b' },
    danger: { bg: '#fef2f2', text: '#ef4444' },
    navy: { bg: '#f1f5f9', text: '#0f172a' },
  };

  const current = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div>
        <div className="stat-label mb-1">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="text-muted small mt-1">{subtitle}</div>}
      </div>
      <div
        className="stat-icon"
        style={{ backgroundColor: current.bg, color: current.text }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
};

export default DashboardCard;
