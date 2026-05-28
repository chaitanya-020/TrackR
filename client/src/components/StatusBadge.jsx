import { STATUS_COLORS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClasses = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;