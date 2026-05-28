import { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationForm from '../components/ApplicationForm';
import FilterBar from '../components/FilterBar';
import ConfirmDialog from '../components/ConfirmDialog';

const Applications = () => {
  const {
    applications,
    loading,
    error,
    filters,
    setFilters,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingApp) {
      await updateApplication(editingApp._id, data);
    } else {
      await createApplication(data);
    }
    setFormOpen(false);
    setEditingApp(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteApplication(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : applications.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 mt-1">
            {filters.search || filters.status
              ? 'Try adjusting your filters.'
              : 'Click "Add Application" to start tracking.'}
          </p>
        </div>
      ) : (
        /* Grid of cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ApplicationForm
        open={formOpen}
        application={editingApp}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditingApp(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete application?"
        message={
          deleteTarget
            ? `This will permanently delete your ${deleteTarget.role} application at ${deleteTarget.company}.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Applications;