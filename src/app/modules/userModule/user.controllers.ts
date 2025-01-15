import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import IdGenerator from '../../../utils/IdGenerator';
import CustomError from '../../errors';
import userServices from './user.services';
import sendMail from '../../../utils/sendEmail';
import { Request, Response } from 'express';
import jwtHelpers from '../../../healpers/healper.jwt';
import config from '../../../config';
import referralCodeServices from '../referralCodeModule/refarralCode.services';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import authServices from '../authModule/userAuthModule/auth.services';

// controller for create new user
const createUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const userInOutlet = await authServices.getOutletByEmail(userData.email);
  if (userInOutlet) {
    throw new CustomError.BadRequestError('Email already used!');
  }
  const userId = IdGenerator.generateId();

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 30);

  userData.userId = userId;
  userData.verification = {
    code: IdGenerator.generateNumberId(),
    expireDate,
  };

  // token for social user
  let accessToken, refreshToken;
  if (userData.isSocial) {
    userData.isEmailVerified = true;

    const payload = {
      userId: userId,
      email: userData.email,
      role: 'user',
    };
    accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret as string, config.jwt_access_token_expiresin as string);
    refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret as string, config.jwt_refresh_token_expiresin as string);
  }

  const user = await userServices.createUser(userData);
  if (!user) {
    throw new CustomError.BadRequestError('Failed to create new user!');
  }

  // create referral code of owner user
  const generateReferralCode = IdGenerator.generateReferralCode();
  await referralCodeServices.createReferralCode({
    user: user._id,
    code: generateReferralCode,
  });

  // add point if referral code provide
  if (userData.referralCode) {
    const getReferralcode = await referralCodeServices.getReferralCodeByReferralCode(userData.referralCode);
    if (getReferralcode) {
      const user = await userServices.getSpecificUser(getReferralcode._id as unknown as string);
      user.point = +Number(config.referral_point);
    }
  }

  const { password, ...userInfoAcceptPass } = user.toObject();

  if (!userData.isSocial) {
    // send email verification mail
    const content = `Your email veirfication code is ${userData?.verification?.code}`;
    // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
    // const content = `Click the following link to verify your email: ${verificationLink}`
    const mailOptions = {
      from: 'fahadhossain0503@gmail.com',
      to: userData.email,
      subject: 'Salon-App - Email Verification',
      text: content,
    };

    sendMail(mailOptions);
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User creation successfull',
    data: { ...userInfoAcceptPass, accessToken, refreshToken },
  });
};

// service for get specific user by id
const getSpecificUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userServices.getSpecificUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User retrive successfull',
    data: user,
  });
};
// service for get specific user by id
// const getAllUser = async (req: Request, res: Response) => {
//   const users = await userServices.getAllUser();

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: 'success',
//     message: 'User retrive successfull',
//     data: users,
//   });
// };
const getAllUser = async (req: Request, res: Response) => {
  const { query, role } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const users = await userServices.getAllUser(query as string, role as string, skip, limit);

  const totalUsers = users.length || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User retrive successfull',
    meta: {
      totalData: totalUsers,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: users,
  });
};

// controller for delete specific user
const deleteSpecificUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userServices.deleteSpecificUser(id);
  if (!user.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete user!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User delete successfull',
  });
};

// controller for update specific user
const updateSpecificUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (data.userId || data.password || data.email || data.isEmailVerified) {
    throw new CustomError.BadRequestError("You can't update usesrId, email, verified status and password directly!");
  }

  const updatedUser = await userServices.updateSpecificUser(id, data);
  if (!updatedUser.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update user!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User modified successfull',
  });
};

// controller for change profile image of specific user
const changeUserProfileImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files;
  // console.log(files)
  const user = await userServices.getSpecificUser(id);
  // console.log(req.files)
  if (!user) {
    throw new CustomError.NotFoundError('No user found!');
  }

  const userImagePath = await fileUploader(files as FileArray, `user-image-${user.userId}`, 'image');
  const updateUser = await userServices.updateSpecificUser(id, {
    image: userImagePath as string,
  });

  if (!updateUser.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to change user profile image!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User profile change successfull',
  });
};

// controller for get referral code by user
const getRefarralCode = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userServices.getSpecificUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const referralCode = await referralCodeServices.getReferralCodeByUserId(id);
  if (!referralCode) {
    throw new CustomError.NotFoundError('Referral code not found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Referral code retrive successfull',
    data: referralCode,
  });
};

export default {
  createUser,
  getSpecificUser,
  getAllUser,
  deleteSpecificUser,
  updateSpecificUser,
  changeUserProfileImage,
  getRefarralCode
};
