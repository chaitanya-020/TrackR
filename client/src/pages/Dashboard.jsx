import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome back, <span className="font-semibold">{user?.name}</span>! 
        Your applications will appear here.
      </p>
      <div className="mt-8 p-8 bg-white border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        Dashboard coming Day 5 — for now, auth is working ✓
      </div>
    </div>
  );
};

export default Dashboard;