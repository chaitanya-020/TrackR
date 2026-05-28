// Must match STATUS_VALUES in server/models/Application.js
export const STATUS_OPTIONS = [
  'Applied',
  'OA',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const JOB_TYPE_OPTIONS = ['Full-time', 'Internship', 'Contract', 'Part-time'];

// Tailwind color classes for each status — used by StatusBadge
export const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  OA: 'bg-purple-100 text-purple-800 border-purple-200',
  'Phone Screen': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Technical: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Onsite: 'bg-amber-100 text-amber-800 border-amber-200',
  Offer: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
};