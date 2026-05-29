import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { STATUS_COLORS } from '../utils/constants';

// Map Tailwind status colors to hex for Recharts (which doesn't understand Tailwind classes)
const STATUS_HEX = {
  Applied: '#3b82f6',       // blue
  OA: '#a855f7',            // purple
  'Phone Screen': '#6366f1', // indigo
  Technical: '#06b6d4',     // cyan
  Onsite: '#f59e0b',        // amber
  Offer: '#10b981',         // green
  Rejected: '#ef4444',      // red
  Withdrawn: '#9ca3af',     // gray
};

const StatusBreakdownChart = ({ statusBreakdown = [] }) => {
  // Transform backend data: [{ _id: 'Applied', count: 5 }, ...] → recharts format
  const data = statusBreakdown.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No data yet — add applications to see your pipeline
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_HEX[entry.name] || '#9ca3af'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} application${value !== 1 ? 's' : ''}`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusBreakdownChart;