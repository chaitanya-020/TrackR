const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      // No longer "required" at schema level — validated conditionally below
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    // Google's unique user ID — null for password-only users
    googleId: {
      type: String,
      index: true,
      sparse: true, // Index only documents that have this field
    },
    // Tracks which auth methods this user has connected
    authProviders: {
      type: [String],
      enum: ['local', 'google'],
      default: ['local'],
    },
    // Profile picture from Google (optional, nice to have)
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation: password is required ONLY if 'local' is in authProviders
userSchema.pre('validate', function (next) {
  if (this.authProviders.includes('local') && !this.password) {
    this.invalidate('password', 'Password is required for email/password accounts');
  }
  next();
});

// Hash password before save — only if password was modified AND exists
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google-only user can't password-login
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);