import mongoose from 'mongoose';
import { ISchedule } from './schedule.interface';

const scheduleSchema = new mongoose.Schema<ISchedule>(
  {
    daySlot: [
      {
        dayName: String,
        dayIndex: Number,
        openTime: String,
        closeTime: String,
        isClosed: Boolean,
      },
    ],
    outlet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "outlet"
    },
    timeSlot: [String],
    capacityOnTime: Number,
  },
  {
    timestamps: true,
  },
);

const Schedule = mongoose.model<ISchedule>('schedule', scheduleSchema);
export default Schedule;
