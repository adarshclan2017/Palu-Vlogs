import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin'
  },
  avatar: {
    type: String,
    default: '/assets/images/logo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt ONLY if it has been modified and not already hashed
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Prevent double-hashing if already a valid bcrypt hash
  if (typeof this.password === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password)) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Use existing model if already compiled (avoids Vercel hot-reload errors)
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
