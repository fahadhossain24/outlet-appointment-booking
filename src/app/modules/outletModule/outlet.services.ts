import { ObjectId, Types } from 'mongoose';
import { IOutlet } from './outlet.interface';
import Outlet from './outlet.model';

// service for create new outlet
const createOutlet = async (data: IOutlet) => {
  return await Outlet.create(data);
};

// service for get specific outlet
const getSpecificOutlet = async (id: string): Promise<IOutlet> => {
  return await Outlet.findOne({ _id: id }).select('-password');
};

// service for get outlets by service category
// const getOutletsByServiceCategory = async (id: string, query: string, skip: number, limit: number) => {
//   return await Outlet.find({ categoryId: id }).populate('categoryId').skip(skip).limit(limit);
// };
const getOutletsByServiceCategory = async (id: string, query: string, skip: number, limit: number) => {
  let filter: any = { categoryId: id, status: 'active' };

  // If a search query is provided, perform a text search or regex search
  if (query) {
    filter.$text = { $search: query}; // Assuming the `Outlet` model has a text index on relevant fields
  }

  return await Outlet.find(filter).populate('categoryId').skip(skip).limit(limit);
};

// service for get all outlets
const getAllOutlets = async (type: string, query: string, skip: number, limit: number) => {
  let filter: any = { };

  if(type){
    filter.type = type;
  }

  // If a search query is provided, perform a text search or regex search
  if (query) {
    filter.$text = { $search: query}; // Assuming the `Outlet` model has a text index on relevant fields
  }

console.log(filter)
  return await Outlet.find(filter).populate('categoryId').skip(skip).limit(limit);
};

// service for get recommended outlets by service category
const getRecommendedOutletsByServiceCategory = async (id: string, query: string, skip: number, limit: number) => {
  let filter: any = { categoryId: id, isRecommended: true };

  // If a search query is provided, perform a text search or regex search
  if (query) {
    filter.$text = { $search: query}; // Assuming the `Outlet` model has a text index on relevant fields
  }

  return await Outlet.find(filter).populate('categoryId').skip(skip).limit(limit);
};

// service for update specific outlet
const updateSpecificOutlet = async (id: string, data: Partial<IOutlet>) => {
  return await Outlet.updateOne({ _id: id }, data, {
    runValidators: true,
  });
};

// service for delete specific outlet
const deleteSpecificOutlet = async (id: string) => {
  return await Outlet.deleteOne({ _id: id });
};

// service to get all question
// const getAllQuestion = async (query, skip, limit) => {
//   let filter = {};

//   // If a search query is provided, perform a text search
//   if (query) {
//     filter = { $text: { $search: query } };
//   }

//   return await Question.find(filter)
//     .skip(skip)
//     .limit(limit);
// };

export default {
  createOutlet,
  getSpecificOutlet,
  getOutletsByServiceCategory,
  getAllOutlets,
  getRecommendedOutletsByServiceCategory,
  updateSpecificOutlet,
  deleteSpecificOutlet,
};
