import { Document } from 'mongoose';

export interface ISlider extends Document {
  name: string;
  description: string;
  image: string;
}
