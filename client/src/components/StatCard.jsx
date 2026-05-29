const StatCard = ({ icon: Icon, label, value, sublabel, accentColor = 'primary' }) => {
  // Tailwind needs full class names in source for the JIT compiler to pick them up
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorMap[accentColor]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;