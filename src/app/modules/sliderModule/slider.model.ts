import mongoose from 'mongoose';
import { ISlider } from './slider.interface';

const sliderSchema = new mongoose.Schema<ISlider>(
  {
    name: String,
    description: String,
    image: String
  },
  {
    timestamps: true,
  },
);

const Slider = mongoose.model<ISlider>('slider', sliderSchema);
export default Slider;
