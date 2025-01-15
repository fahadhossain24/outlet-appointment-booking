import { Document, Types } from "mongoose";

export interface ISchedule extends Document{
    daySlot: {
        dayName: string,
        dayIndex: number,
        openTime: string,
        closeTime: string,
        isClosed: boolean,
        _id: Types.ObjectId
    }[],
    outlet: {
        outletId: Types.ObjectId,
        name: string,
        type: string
    },
    timeSlot: string[],
    capacityOnTime: number
}