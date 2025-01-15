import { Request, Response } from 'express';
import Earning from './earning.model';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import earningServices from './earning.services';

// controller for retrive earning by outletId
const retriveEarningByOutletId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const earning = await earningServices.retriveEarningByOutletId(id)
  
  if (!earning) {
    throw new CustomError.BadRequestError('No earning found!');
  }
console.log(earning)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Earning retrive successful!`,
    data: earning,
  });
};

export default {
    retriveEarningByOutletId
}
