import express from 'express';
import scheduleControllers from './schedule.controllers';

const scheduleRouter = express.Router();

scheduleRouter.post('/create-or-update', scheduleControllers.upsertSchedule)
scheduleRouter.post('/timeslot/create-or-update', scheduleControllers.updateDedicatedTimeSlot)
scheduleRouter.get('/retrive/:outletId', scheduleControllers.getScheduleByOutletId)

export default scheduleRouter;
