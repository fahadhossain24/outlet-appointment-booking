import { INotification } from "./notification.interface"
import Notification from "./notification.model"

// service for create new NotificationService
const createNotification = async(data: Partial<INotification>) => {
    return await Notification.create(data)
}

// service for get all notification by userId
 const getAllNotificationByUserId = async(userId: string) => {
    return await Notification.find({'user.userId': userId})
}

// service for update notification by id
const updateNotificationByUserId = async(id: string, status: boolean) => {
    return await Notification.updateOne({_id: id}, {isDismissed: status}, {
        runValidators: true
    })
}

export default {
    createNotification,
    getAllNotificationByUserId,
    updateNotificationByUserId
}