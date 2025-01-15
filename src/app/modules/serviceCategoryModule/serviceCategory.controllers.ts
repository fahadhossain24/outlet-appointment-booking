import { Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import serviceCategoryServices from './serviceCategory.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// controller for create service category
const createServiceCategory = async (req: Request, res: Response) => {
  const files = req.files;
  const serviceCategoryImagePath = await fileUploader(files as FileArray, `main-service-category-image`, 'image');
  req.body.image = serviceCategoryImagePath;

  const serviceCategory = await serviceCategoryServices.createServiceCategory(req.body);
  if (!serviceCategory) {
    throw new CustomError.BadRequestError('Failed to create service category');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Service category created successfull',
    data: serviceCategory,
  });
};

// controller for get all service category
const getAllServiceCategory = async (req: Request, res: Response) => {
  const serviceCategories = await serviceCategoryServices.getAllServiceCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Service categories retrive successfull',
    data: serviceCategories,
  });
};

// controller for get specific service category
const getSpecificServiceCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError('Missing id in request params!');
  }
  const serviceCategory = await serviceCategoryServices.getSpecificServiceCategory(id);
  if (!serviceCategory) {
    throw new CustomError.BadRequestError('No service category found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Service category retrive successfull',
    data: serviceCategory,
  });
};

export default {
  createServiceCategory,
  getAllServiceCategory,
  getSpecificServiceCategory,
};
