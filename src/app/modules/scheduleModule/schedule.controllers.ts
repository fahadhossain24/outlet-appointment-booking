// controller for upsert schedule
import { Request, Response } from 'express';
import Schedule from './schedule.model';
import mongoose from 'mongoose';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ISchedule } from './schedule.interface';

// controller for upsert schedule
const upsertSchedule = async (req: Request, res: Response) => {
  const { outlet, daySlot, timeSlot, capacityOnTime } = req.body;

  // Find or create a schedule for the given outlet
  let schedule: any = await Schedule.findOne({ outlet: outlet });

  if (!schedule) {
    schedule = new Schedule({
      outlet,
      daySlot,
      timeSlot,
      capacityOnTime,
    });
  } else {
    // Update existing schedule
    if (daySlot && Array.isArray(daySlot)) {
      daySlot.forEach((newDay) => {
        const existingDayIndex = schedule?.daySlot.findIndex((day: any) => day.dayName === newDay.dayName);

        if (existingDayIndex !== -1) {
          // Update existing day slot
          schedule.daySlot[existingDayIndex as number] = { ...schedule.daySlot[existingDayIndex as number], ...newDay };
        } else {
          // Add new day slot if it doesn't exist
          schedule?.daySlot.push(newDay);
        }
      });
    }

    // Update other fields if provided
    if (timeSlot) schedule.timeSlot = [...timeSlot];
    if (capacityOnTime) schedule.capacityOnTime = capacityOnTime;
  }

  // Save the schedule
  const updatedSchedule = await schedule.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Schedule modification successfully`,
    data: updatedSchedule,
  });
};

// controller for add time slot based on outlet id in schedule
const updateDedicatedTimeSlot = async (req: Request, res: Response) => {
  const { outletId, timeSlots, capacityOnTime } = req.body;

  // Find the schedule by outletId
  const schedule = await Schedule.findOne({ outlet: outletId });

  if (!schedule) {
    throw new CustomError.NotFoundError('Schedule not found for this outlet!');
  }

  // Merge existing time slots with new ones, ensuring uniqueness
  const updatedTimeSlots = Array.from(new Set([...schedule.timeSlot, ...timeSlots]));

  schedule.timeSlot = updatedTimeSlots;
  schedule.capacityOnTime = capacityOnTime;
  await schedule.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Time slots updated successfully.`,
    data: schedule,
  });
};

// controller for retrive schedule by outletId
const getScheduleByOutletId = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const schedule = await Schedule.findOne({ outlet: outletId });
  if (!schedule) {
    throw new CustomError.BadRequestError('No schedule found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Schedule retrive successfull`,
    data: schedule,
  });
};

export default {
  upsertSchedule,
  updateDedicatedTimeSlot,
  getScheduleByOutletId,
};
