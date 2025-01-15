import express from 'express';
import outletControllers from './outlet.controllers';
import authorization from '../../middlewares/authorization';

const outletRouter = express.Router();

outletRouter.post('/create', authorization('super-admin', 'admin'), outletControllers.createOutlet);
outletRouter.get(
  '/retrive/category/:serviceCategoryId/search',
  authorization('outlet', 'super-admin', 'admin', 'user'),
  outletControllers.getOutletsByServiceCategory,
);
outletRouter.get(
  '/retrive/search',
  authorization('outlet', 'super-admin', 'admin', 'user'),
  outletControllers.getAllOutlets,
);
outletRouter.get(
  '/retrive/recommended/category/:serviceCategoryId/search',
  authorization('outlet', 'super-admin', 'admin', 'user'),
  outletControllers.getRecommendedOutletsByServiceCategory,
);
outletRouter.patch('/update/:id', authorization('outlet', 'super-admin', 'admin', 'user'), outletControllers.updateSpecificOutlet);
outletRouter.patch('/change/profile/:id', authorization('outlet', 'super-admin', 'admin'), outletControllers.changeOutletProfileImage);
outletRouter.patch('/change/cover/:id', authorization('outlet', 'super-admin', 'admin'), outletControllers.changeOutletCoverImage);
outletRouter.get('/retrive/:id', authorization('outlet', 'super-admin', 'admin', "user"), outletControllers.getOutletByOutletId);
outletRouter.delete('/delete/:id', authorization('outlet', 'super-admin', 'admin'), outletControllers.deleteSpecificOutlet);

export default outletRouter;
