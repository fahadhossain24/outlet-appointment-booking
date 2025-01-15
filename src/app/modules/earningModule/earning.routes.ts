import express from 'express'
import earningControllers from './earning.controllers'

const earningRouter = express.Router()

earningRouter.get('/retrive/outlet/:id', earningControllers.retriveEarningByOutletId)

export default earningRouter