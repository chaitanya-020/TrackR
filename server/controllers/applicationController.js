const Application = require('../models/Application');
const { validationResult } = require('express-validator');

// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Force user field to the logged-in user — never trust req.body for this
    const application = await Application.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error creating application' });
  }
};

// @route   GET /api/applications
// @access  Private
// Supports: ?status=Applied&search=Google&sortBy=dateApplied&order=desc&page=1&limit=20
const getApplications = async (req, res) => {
  try {
    const {
      status,
      search,
      sortBy = 'dateApplied',
      order = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    // Build query — always scoped to logged-in user
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      // Case-insensitive search across company and role
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Run query + total count in parallel
    const [applications, total] = await Promise.all([
      Application.find(query).sort(sort).skip(skip).limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: applications.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// @route   GET /api/applications/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [statusBreakdown, totalCount, weeklyData, responseStats] = await Promise.all([
      // Count by status
      Application.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Total applications
      Application.countDocuments({ user: userId }),

      // Applications per week (last 12 weeks)
      Application.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$dateApplied' },
              week: { $week: '$dateApplied' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.week': -1 } },
        { $limit: 12 },
      ]),

      // Response rate: anything past "Applied" counts as a response
      Application.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            responses: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      '$status',
                      ['OA', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected'],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            offers: {
              $sum: { $cond: [{ $eq: ['$status', 'Offer'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const responseRate = responseStats[0]
      ? ((responseStats[0].responses / responseStats[0].total) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      stats: {
        totalApplications: totalCount,
        statusBreakdown,
        weeklyData,
        responseRate: parseFloat(responseRate),
        offers: responseStats[0]?.offers || 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Authorization: user can only access their own applications
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this application' });
    }

    res.json({ success: true, application });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
};

// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Strip user field if present — prevent reassignment to another user
    const { user, ...updates } = req.body;

    application = await Application.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, application });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error updating application' });
  }
};

// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await application.deleteOne();

    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error deleting application' });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStats,
};