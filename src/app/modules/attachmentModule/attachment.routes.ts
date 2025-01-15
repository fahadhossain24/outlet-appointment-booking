import express from 'express';
import authorization from '../../middlewares/authorization';
import attachmentControllers from './attachment.controllers';

const attachmentRouter = express.Router();

attachmentRouter.get('/retrive/:conversationId', authorization('user', 'admin', 'super-admin'), attachmentControllers.retriveAttachmentByConversation)

export default attachmentRouter;