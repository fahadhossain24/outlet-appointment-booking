import mongoose from 'mongoose';
import { IOutlet } from './outlet.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';

const outletSchema = new mongoose.Schema<IOutlet>(
  {
    outletId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: {
        values: ['Salon', 'Spa', 'Pets'],
        message: "{VALUE} is not accepted as outlet type. Use Salon/Spa/Pets as type of outlet."
      },
    },
    name: {
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
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!'],
    },
    status: {
      type: String,
      enum: ['active', 'disable'],
      default: 'active',
    },
    profileImage: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    location: {
      latitude: String,
      longitude: String,
      address: String,
    },
    nidNumber: {
      type: String,
      required: true,
    },
    nidImage: {
      type: String,
      default: '',
    },
    bankAccountNumber: String,
    experience: String,
    about: String,
    role: {
      type: String,
      enum: ['outlet'],
      default: 'outlet',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'serviceCategory',
    },
    isRecommended: {
      type: Boolean,
      default: false,
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  },
);

outletSchema.pre('save', function (next) {
  const saltRounds = 10;
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  next();
});

outletSchema.methods.comparePassword = function (userPlanePassword: string) {
  return bcrypt.compareSync(userPlanePassword, this.password);
};

outletSchema.methods.compareVerificationCode = function (userPlaneCode: string) {
  return bcrypt.compareSync(userPlaneCode, this.verification.code);
};

outletSchema.index(
  {
    name: 'text',
    email: 'text',
    phone: 'text',
    nidNumber: 'text',
    bankAccountNumber: 'text'
  }
)


const Outlet = mongoose.model<IOutlet>('outlet', outletSchema);
export default Outlet;
