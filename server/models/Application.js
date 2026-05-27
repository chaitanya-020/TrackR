const mongoose = require('mongoose');

const STATUS_VALUES = [
  'Applied',
  'OA',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const JOB_TYPE_VALUES = ['Full-time', 'Internship', 'Contract', 'Part-time'];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Indexed because every query filters by user
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [100, 'Company name too long'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role name too long'],
    },
    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    dateApplied: {
      type: Date,
      required: true,
      default: Date.now,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    jobType: {
      type: String,
      enum: JOB_TYPE_VALUES,
      default: 'Full-time',
    },
    jobLink: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes too long'],
    },
    nextStep: {
      type: String,
      maxlength: 200,
    },
    nextStepDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for the most common query: "all my apps, newest first"
applicationSchema.index({ user: 1, dateApplied: -1 });

const Application = mongoose.model('Application', applicationSchema);

// Export constants alongside the model so routes can use them for validation
Application.STATUS_VALUES = STATUS_VALUES;
Application.JOB_TYPE_VALUES = JOB_TYPE_VALUES;

module.exports = Application;