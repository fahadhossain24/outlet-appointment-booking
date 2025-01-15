import { Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  image: string;
}
