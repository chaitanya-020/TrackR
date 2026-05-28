import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome back, <span className="font-semibold">{user?.name}</span>!
      </p>

      <div className="mt-8 p-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-600 mb-4">
          Stats and charts coming on Day 5. For now, manage your applications:
        </p>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          Go to Applications
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;