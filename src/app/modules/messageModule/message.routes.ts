import express from 'express';
import authorization from '../../middlewares/authorization';
import messageControllers from './message.controllers';

const messageRouter = express.Router();

messageRouter.post('/send', authorization('user', 'admin', 'super-admin'), messageControllers.createMessage)
messageRouter.get('/retrive/:conversationId', authorization('user', 'admin', 'super-admin'), messageControllers.retriveMessagesByConversation)

export default messageRouter;