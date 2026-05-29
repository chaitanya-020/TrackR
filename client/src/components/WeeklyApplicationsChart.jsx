import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Convert ISO week + year into a readable label like "Wk 12 '25" or "Mar 24"
const formatWeekLabel = (year, week) => {
  // Approximate the start date of the week — good enough for axis labels
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const weekStart = new Date(year, 0, 1 + daysOffset - jan1.getDay());
  return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const WeeklyApplicationsChart = ({ weeklyData = [] }) => {
  // Backend returns newest-first; chart reads left-to-right oldest → newest
  const data = [...weeklyData]
    .reverse()
    .map((item) => ({
      label: formatWeekLabel(item._id.year, item._id.week),
      count: item.count,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Per Week</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No data yet — apply to jobs to see your weekly cadence
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Per Week</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} application${value !== 1 ? 's' : ''}`, 'Total']}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyApplicationsChart;