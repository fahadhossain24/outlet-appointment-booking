import { Request, Response } from 'express';
import conversationService from './conversation.service';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import SocketManager from '../../../socket/manager.socket';
import createNotification from '../../../utils/notificationCreator';

// controller for create new conversation
const createConversation = async (req: Request, res: Response) => {
  const conversationData = req.body;
  const socketManager = SocketManager.getInstance();
  const existConversation = await conversationService.retriveConversationByUserId(conversationData.user.userId);
  if (existConversation) {
    // function for cratea and join user using conversationId
    socketManager.joinUser(existConversation);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: `Conversation retrive successfull`,
      data: existConversation,
    });
  } else {
    const conversation = await conversationService.createConversation(conversationData);

    if (!conversation) {
      throw new CustomError.BadRequestError('Failed to create conversation!');
    }

    // function for cratea and join user using conversationId
    socketManager.joinUser(conversation);

    // create notification for new conversation
    createNotification(conversationData.user.userId, conversationData.user.name, `New conversation created.`);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: `Conversation created successfull`,
      data: conversation,
    });
  }
};

// controller for get all conversation by senderId
const retriveConversations = async (req: Request, res: Response) => {
  const conversations = await conversationService.retriveConversations();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Conversations retrive successful!`,
    data: conversations,
  });
};

// controller for search cconversations
const searchConversations = async (req: Request, res: Response) => {
  const { query } = req.query;
  const conversations = await conversationService.searchConversation(query as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Conversations retrive successful!`,
    data: conversations,
  });
};

export default {
  createConversation,
  retriveConversations,
  searchConversations,
};
