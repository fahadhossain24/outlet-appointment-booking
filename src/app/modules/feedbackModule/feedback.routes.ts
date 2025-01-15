import express from 'express'
import feedbackControllers from './feedback.controllers'

const feedbackRouter = express.Router()

feedbackRouter.post('/create-or-update', feedbackControllers.createOrUpdateFeedback)
feedbackRouter.get('/retrive/all/outlet/:outletId', feedbackControllers.getFeedbacksByOutletIds)

export default feedbackRouter