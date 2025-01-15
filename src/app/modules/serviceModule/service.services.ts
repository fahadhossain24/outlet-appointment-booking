import { IService } from './service.interface';
import Service from './service.model';

// service for create new service
const createService = async (data: Partial<IService>) => {
  return await Service.create(data);
};

// service for get all service by outletid
const getServicesByOutlet = async (outletId: string, skip: number, limit: number) => {
  return await Service.find({ 'outlet.outletId': outletId }).populate('outlet.outletId').skip(skip).limit(limit);
};

const getServicesByOutletForUser = async (outletId: string, skip: number, limit: number) => {
  return await Service.find({ 'outlet.outletId': outletId }).skip(skip).limit(limit);
};

const getSpecificService = async (id: string) => {
  return await Service.findOne({ _id : id })
};

// service for update specific service
const updateSpecificService = async (id: string, data: Partial<IService>) => {
  return await Service.updateOne({ _id: id }, data, {
    runValidators: true,
  });
};

// service for delete specific service
const deleteSpecificService = async (id: string) => {
  return await Service.deleteOne({ _id: id });
};

// service for retrive discounted services
const getDiscountedServices = async () => {
  return await Service.find({ isDiscount: true })
};

// service for retrive popular service
const getPopularServices = async (documentCount: number = 0) => {
  return await Service.find().sort('-consumeCount').limit(documentCount)
};

// service for retrive popular service
const getAllServices = async (query: string, skip: number, limit: number) => {
  const filter: any = {}
  if (query) {
    filter.$text = { $search: query}; 
  }
  return await Service.find(filter).skip(skip).limit(limit)
};

export default {
  createService,
  getServicesByOutlet,
  getSpecificService,
  getServicesByOutletForUser,
  updateSpecificService,
  deleteSpecificService,
  getDiscountedServices,
  getPopularServices,
  getAllServices,
};
