import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import jwtHelpers from '../../../healpers/healper.jwt';
import sendResponse from '../../../shared/sendResponse';
import IdGenerator from '../../../utils/IdGenerator';
import CustomError from '../../errors';
import authServices from '../authModule/userAuthModule/auth.services';
import outletServices from './outlet.services';
import { Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import Schedule from '../scheduleModule/schedule.model';
import Feedback from '../feedbackModule/feedback.model';

// controller for create new outlet
const createOutlet = async (req: Request, res: Response) => {
  const outletData = req.body;
  const files = req.files;

  const userInUsersCollection = await authServices.getUserByEmail(outletData.email as string);
  if (userInUsersCollection) {
    throw new CustomError.BadRequestError('Email already used!');
  }
  const outletId = IdGenerator.generateId();
  outletData.outletId = outletId;

  const location = {
    latitude: outletData.latitude,
    longitude: outletData.longitude,
    address: outletData.address,
  };
  outletData.location = location;

  const profileImagePath = await fileUploader(files as FileArray, `${outletData.type}-image`, 'profileImage');
  const nidImagePath = await fileUploader(files as FileArray, `${outletData.type}-image`, 'nidImage');

  outletData.profileImage = profileImagePath;
  outletData.nidImage = nidImagePath;

  const outlet = await outletServices.createOutlet(outletData);
  if (!outlet) {
    throw new CustomError.BadRequestError(`Failed to create new ${outletData.type}!`);
  }

  const { password, ...outletInfoAcceptPass } = outlet.toObject();

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `${outletData.type} creation successfull`,
    data: outletInfoAcceptPass,
  });
};

// controller for get all outlets by main service category
const getOutletsByServiceCategory = async (req: Request, res: Response) => {
  const { serviceCategoryId } = req.params;
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  if (!serviceCategoryId) {
    throw new CustomError.BadRequestError('Missing service category Id in request params!');
  }

  const skip = (page - 1) * limit;
  const outlets = await outletServices.getOutletsByServiceCategory(serviceCategoryId, query as string, skip, limit);

  const enrichedOutlets = await Promise.all(
    outlets.map(async (outlet) => {
      const schedule = await Schedule.findOne({ outlet: outlet._id });
      const feedbacksOfOutlet = await Feedback.find({ 'outlet.outletId': outlet._id });
      let topRating = 0;
      feedbacksOfOutlet.forEach((feedback) => {
        if (feedback.rating > topRating) {
          topRating = feedback.rating;
        }
        return topRating;
      });
      let enrichedOutlet = { ...outlet.toObject(), rating: topRating || 0 }; // Convert to plain object
      if (schedule) {
        const days = `${schedule.daySlot[0].dayName} - ${schedule.daySlot[schedule.daySlot.length - 1].dayName}`;
        const times = `${schedule.timeSlot[0]} - ${schedule.timeSlot[schedule.timeSlot.length - 1]}`;
        enrichedOutlet.scheduleStamp = { days, times }; // Add scheduleStamp
      }
      return enrichedOutlet; // Return the enriched outlet
    }),
  );

  const totalOutlets = enrichedOutlets.length || 0;
  const totalPages = Math.ceil(totalOutlets / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Outlets retrive successfull!',
    meta: {
      totalData: totalOutlets,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: enrichedOutlets,
  });
};

// controller for get all outlets
const getAllOutlets = async (req: Request, res: Response) => {
  const { type, query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const outlets = await outletServices.getAllOutlets(type as string, query as string, skip, limit);
  console.log(outlets)

  const enrichedOutlets = await Promise.all(
    outlets.map(async (outlet) => {
      const schedule = await Schedule.findOne({ outlet: outlet._id });
      const feedbacksOfOutlet = await Feedback.find({ 'outlet.outletId': outlet._id });
      let topRating = 0;
      feedbacksOfOutlet.forEach((feedback) => {
        if (feedback.rating > topRating) {
          topRating = feedback.rating;
        }
        return topRating;
      });
      let enrichedOutlet = { ...outlet.toObject(), rating: topRating || 0 }; // Convert to plain object
      if (schedule) {
        const days = `${schedule.daySlot[0].dayName} - ${schedule.daySlot[schedule.daySlot.length - 1].dayName}`;
        const times = `${schedule.timeSlot[0]} - ${schedule.timeSlot[schedule.timeSlot.length - 1]}`;
        enrichedOutlet.scheduleStamp = { days, times }; // Add scheduleStamp
      }
      return enrichedOutlet; // Return the enriched outlet
    }),
  );

  const totalOutlets = enrichedOutlets.length || 0;
  const totalPages = Math.ceil(totalOutlets / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Outlets retrive successfull!',
    meta: {
      totalData: totalOutlets,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: enrichedOutlets,
  });
};

// controller for get all recommended outlets by main service category
const getRecommendedOutletsByServiceCategory = async (req: Request, res: Response) => {
  const { serviceCategoryId } = req.params;
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  if (!serviceCategoryId) {
    throw new CustomError.BadRequestError('Missing service category ID in request params!');
  }

  const skip = (page - 1) * limit;

  // Retrieve outlets
  const outlets = await outletServices.getRecommendedOutletsByServiceCategory(serviceCategoryId, query as string, skip, limit);

  // Enrich outlets with scheduleStamp
  const enrichedOutlets = await Promise.all(
    outlets.map(async (outlet) => {
      const schedule = await Schedule.findOne({ outlet: outlet._id });
      const feedbacksOfOutlet = await Feedback.find({ 'outlet.outletId': outlet._id });
      let topRating = 0;
      feedbacksOfOutlet.forEach((feedback) => {
        if (feedback.rating > topRating) {
          topRating = feedback.rating;
        }
        return topRating;
      });
      let enrichedOutlet = { ...outlet.toObject(), rating: topRating || 0 }; // Convert to plain object
      if (schedule) {
        const days = `${schedule.daySlot[0].dayName} - ${schedule.daySlot[schedule.daySlot.length - 1].dayName}`;
        // const times = `${schedule.timeSlot[0]} - ${schedule.timeSlot[schedule.timeSlot.length - 1]}`;
        const times = `${schedule.daySlot[0].openTime} - ${schedule.daySlot[0].closeTime}`;
        enrichedOutlet.scheduleStamp = { days, times }; // Add scheduleStamp
      }
      return enrichedOutlet; // Return the enriched outlet
    }),
  );
  // Total outlets and pagination calculations
  const totalOutlets = enrichedOutlets.length || 0;
  const totalPages = Math.ceil(totalOutlets / limit);

  // Send response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Recommended outlets retrieved successfully!',
    meta: {
      totalData: totalOutlets,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: enrichedOutlets,
  });
};

// controller for update specific outlet
const updateSpecificOutlet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files;
  const updateData = req.body;

  const outlet = await outletServices.getSpecificOutlet(id);
  if (!outlet) {
    throw new CustomError.NotFoundError('Outlet not found!');
  }

  if(updateData.password || updateData.email){
    throw new CustomError.BadRequestError("Can't update password or email by the API")
  }

  if (req.files && req.files.nidImage) {
    const nidImagePath = await fileUploader(files as FileArray, `image`, 'nidImage');
    updateData.nidImage = nidImagePath;
  }

  if(req.files && req.files.profileImage){
    const profileImagePath = await fileUploader(files as FileArray, `image`, 'profileImage');
    console.log(profileImagePath)
    updateData.profileImage = profileImagePath;
  }

  const updatedOutlet = await outletServices.updateSpecificOutlet(id, updateData);
  if (!updatedOutlet.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update outlet!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `${outlet.type} updated successfull`,
  });
};

// controller for change outlet profile image
const changeOutletProfileImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const profileImage = req.files;
  if (!id) {
    throw new CustomError.BadRequestError('Missing id in request params!');
  }

  const outlet = await outletServices.getSpecificOutlet(id);
  if (!outlet) {
    throw new CustomError.NotFoundError('Outlet not found!');
  }

  if (profileImage) {
    const profileImagePath = await fileUploader(profileImage as FileArray, `${outlet.type}-image`, 'profileImage');
    outlet.profileImage = profileImagePath as string;
  }

  await outlet.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Profile image change successfull`,
  });
};

// controller for change outlet cover image
const changeOutletCoverImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const coverImage = req.files;
  if (!id) {
    throw new CustomError.BadRequestError('Missing id in request params!');
  }

  const outlet = await outletServices.getSpecificOutlet(id);
  if (!outlet) {
    throw new CustomError.NotFoundError('Outlet not found!');
  }

  if (coverImage) {
    const coverImagePath = await fileUploader(coverImage as FileArray, `${outlet.type}-image`, 'coverImage');
    outlet.coverImage = coverImagePath as string;
  }

  await outlet.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Cover image change successfull`,
  });
};

// controller for get outlet by outletId
const getOutletByOutletId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const outlet = await outletServices.getSpecificOutlet(id);
  if (!outlet) {
    throw new CustomError.BadRequestError('No outlet found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Outlet retrive successfull`,
    data: outlet,
  });
};

// controller for delete specific delete
const deleteSpecificOutlet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const outlet = await outletServices.deleteSpecificOutlet(id);
  if (!outlet.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete outlet!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Outlet delete successfull',
  });
};

// // controller for search outlet inside service category
// const searchOutletInsideServiceCategory = async(req: Request, res: Response) => {
//   const {id} = req.params;
//   const {query} = req.query
//   const page = parseInt(req.query.page as string) || 1
//   const limit = parseInt(req.query.limit as string) || 8

//   const skip = (page - 1) * limit
// }

export default {
  createOutlet,
  getOutletsByServiceCategory,
  getAllOutlets,
  getRecommendedOutletsByServiceCategory,
  updateSpecificOutlet,
  changeOutletProfileImage,
  changeOutletCoverImage,
  getOutletByOutletId,
  deleteSpecificOutlet,
};
