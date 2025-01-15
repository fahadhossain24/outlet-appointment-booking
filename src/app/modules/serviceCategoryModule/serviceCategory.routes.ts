import express from 'express'
import serviceCategoryControllers from './serviceCategory.controllers';

const serviceCategoryRouter = express.Router();

serviceCategoryRouter.post('/create', serviceCategoryControllers.createServiceCategory)
serviceCategoryRouter.get('/retrive/all', serviceCategoryControllers.getAllServiceCategory)
serviceCategoryRouter.get('/retrive/:id', serviceCategoryControllers.getSpecificServiceCategory)

export default serviceCategoryRouter