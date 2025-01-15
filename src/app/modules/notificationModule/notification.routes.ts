import express from 'express'
import notificationControllers from './notification.controllers'

const notificationRouter = express.Router()

notificationRouter.get('/user/:userId', notificationControllers.getNotificationsByUserId)
notificationRouter.patch('/update/:id', notificationControllers.updateNotificationById)

export default notificationRouter