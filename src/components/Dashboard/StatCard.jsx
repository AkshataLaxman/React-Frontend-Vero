const StatCard = ({ icon: Icon, title, value, trend, iconBg, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${iconBg}`}>
          <Icon size={24} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trend.startsWith('+') ? 'positive' : 'negative'}`}>
          {trend} Last Month
        </div>
      )}
    </div>
  );
};

export default StatCard;