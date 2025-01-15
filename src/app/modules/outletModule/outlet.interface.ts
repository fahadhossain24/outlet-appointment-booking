import mongoose, { Document } from 'mongoose';

export interface IOutlet extends Document {
  outletId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  profileImage: string;
  coverImage: string;
  location: {
    latitude: string;
    longitude: string;
    address: string;
  };
  nidNumber: string;
  nidImage: string;
  bankAccountNumber: string;
  experience: string;
  about: string;
  role: string;
  categoryId: mongoose.Schema.Types.ObjectId;
  type: string;
  isRecommended: boolean;
  verification?: {
    code: string;
    expireDate: Date;
  };
  isEmailVerified: boolean;
  scheduleStamp?: {
    days: string;
    times: string;
  };
  rating?: number;

  // methods
  comparePassword(userPlanePassword: string): boolean;
  compareVerificationCode(userPlaneCode: string): boolean;
}
