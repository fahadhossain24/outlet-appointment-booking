import express from 'express';
import authorization from '../../middlewares/authorization';
import conversationControllers from './conversation.controllers';

const conversationRouter = express.Router();

conversationRouter.post('/create', authorization('user', 'admin', 'super-admin'), conversationControllers.createConversation)
conversationRouter.get('/retrive', authorization('user', 'admin', 'super-admin'), conversationControllers.retriveConversations)
conversationRouter.get('/search', authorization('user', 'admin', 'super-admin'), conversationControllers.searchConversations)

export default conversationRouter;