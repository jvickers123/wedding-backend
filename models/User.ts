import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '../helpers/types';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      required: [true, 'Please add an email'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minLength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    methods: {
      getSignedJWTToken() {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      },
      async matchPasswords(enteredPassword: string) {
        return await bcrypt.compare(enteredPassword, this.password);
      },

      getResetPasswordToken() {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

        this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        return resetToken;
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', UserSchema);
