import mongoose from 'mongoose';
import { IServiceCategory } from './serviceCategory.interface';

const serviceCategorySchema = new mongoose.Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: String
  },
  {
    timestamps: true,
  },
);

const ServiceCategory = mongoose.model<IServiceCategory>('serviceCategory', serviceCategorySchema);
export default ServiceCategory;
