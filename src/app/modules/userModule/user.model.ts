import mongoose from 'mongoose';
import IUser from './user.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'blocked', 'disabled'],
        message: '{VALUE} is not accepted as a status value. Use active/blocked/disabled.',
      },
      default: 'active',
    },
    image: {
      type: String,
      default: '',
    },
    verification: {
      code: {
        type: String,
        default: null,
      },
      expireDate: {
        type: Date,
        default: null,
      },
    },
    // referralCode: {
    //   type: String,
    //   default: null,
    // },
    point: {
      type: Number,
      default: 0,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not accepted as a gender value. Use male/female/other.',
      },
    },
    address: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isSocial: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const saltRounds = 10;
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  if (this.isModified('verification.code') && this.verification?.code) {
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds);
  }

  next();
});

userSchema.methods.comparePassword = function (userPlanePassword: string) {
  return bcrypt.compareSync(userPlanePassword, this.password);
};

userSchema.methods.compareVerificationCode = function (userPlaneCode: string) {
  return bcrypt.compareSync(userPlaneCode, this.verification.code);
};

userSchema.index({ fullName: 'text', email: 'text', address: 'text', phone: 'text', gender: 'text' }); 

const User = mongoose.model<IUser>('user', userSchema);
export default User;
