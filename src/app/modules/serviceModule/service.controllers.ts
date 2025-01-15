import { Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import serviceServices from './service.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { number } from 'zod';
import config from '../../../config';

// controller for create service
const createService = async (req: Request, res: Response) => {
  const serviceData = req.body;
  const files = req.files;
  serviceData.isHomeServiceAvailable = serviceData.isHomeServiceAvailable === 'true';

  serviceData.outlet = {
    outletId: serviceData.outletId,
    name: serviceData.outletName,
    type: serviceData.outletType,
  };
  serviceData.price = {
    amount: serviceData.priceAmount,
    currency: serviceData.priceCurrency,
  };
  serviceData.discount = {
    amount: serviceData.discountAmount,
    currency: serviceData.discountCurrency,
    type: serviceData.discountType,
  };

  const serviceImagePath = await fileUploader(files as FileArray, `service-image`, 'image');
  serviceData.image = serviceImagePath;

  const service = await serviceServices.createService(serviceData);
  if (!service) {
    throw new CustomError.BadRequestError('Failed to create service!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Service created successfull!',
    data: service,
  });
};

// controller for get services by outletid
const getServiceByOutletId = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const services = await serviceServices.getServicesByOutlet(outletId, skip, limit);

  const totalServices = services.length || 0;
  const totalPages = Math.ceil(totalServices / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Services retrive successfull!',
    meta: {
      totalData: totalServices,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: services,
  });
};

// controller for get services by serviceId
const updateServiceByServiceId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const serviceData = req.body;
  const files = req.files;

  const service = await serviceServices.getSpecificService(id);
  if (!service) {
    throw new CustomError.NotFoundError('Service not found!');
  }

  if (files) {
    const serviceImagePath = await fileUploader(files as FileArray, `service-image`, 'image');
    serviceData.image = serviceImagePath;
  }

  serviceData.outlet = {
    outletId: serviceData.outletId || service.outlet.outletId,
    name: serviceData.outletName || service.outlet.name,
    type: serviceData.outletType || service.outlet.type,
  };
  serviceData.price = {
    amount: Number(serviceData.priceAmount) || service.price.amount,
    currency: serviceData.priceCurrency || service.price.currency,
  };
  serviceData.discount = {
    amount: serviceData.discountAmount || service.discount.amount,
    currency: serviceData.discountCurrency || service.discount.currency,
    type: serviceData.discountType || service.discount.type,
  };

  const updatedService = await serviceServices.updateSpecificService(id, serviceData);
  if (!updatedService.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update service!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Service update successfull!',
  });
};

// controller for delete service by serviceId
const deleteServiceByServiceId = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedService = await serviceServices.deleteSpecificService(id);
  if (!deletedService.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete service!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Service delete successfull!',
  });
};

// controller for retrive discounted services
const getDiscountedServices = async (req: Request, res: Response) => {
  const services = await serviceServices.getDiscountedServices();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Services retrive successfull!',
    data: services,
  });
};

// controller for retrive popular service
const getPopularServices = async (req: Request, res: Response) => {
  const services = await serviceServices.getPopularServices(Number(config.popular_service_document_count));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Popular services retrive successfull!',
    data: services,
  });
};

// controller for retrive all services
const retriveAllServices = async (req: Request, res: Response) => {
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const services = await serviceServices.getAllServices(query as string, skip, limit);

  const totalServices = services.length || 0;
  const totalPages = Math.ceil(totalServices / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Services retrive successfull!',
    meta: {
      totalData: totalServices,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: services,
  });
};

// controller for get services by outletid for user
const getServiceByOutletIdForUser = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const services = await serviceServices.getServicesByOutletForUser(outletId, skip, limit);

  const totalServices = services.length || 0;
  const totalPages = Math.ceil(totalServices / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Services retrive successfull!',
    meta: {
      totalData: totalServices,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: services,
  });
};

export default {
  createService,
  getServiceByOutletId,
  updateServiceByServiceId,
  deleteServiceByServiceId,
  getDiscountedServices,
  getPopularServices,
  retriveAllServices,
  getServiceByOutletIdForUser,
};
