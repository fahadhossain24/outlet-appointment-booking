import { IConversation } from './conversation.interface';
import Conversation from './conversation.model';

// service for create new conversation
const createConversation = async (data: Partial<IConversation>) => {
  return await Conversation.create(data);
};

// service for retrive specific conversation by userId
const retriveConversationByUserId = async (userId: string) => {
  return await Conversation.findOne({ 'user.userId': userId });
};

// service for retrive specific conversation by conversationId
const retriveConversationByConversationId = async (conversationId: string) => {
  return await Conversation.findOne({ _id: conversationId });
};

// service for retrive all conversations
const retriveConversations = async () => {
  return await Conversation.find().populate('user.userId').populate('lastMessage');
};

// service for search conversation
const searchConversation = async (searchQuery: string) => {
    let query = {}
    if(searchQuery){
        query = { $text: { $search: searchQuery } }
    }
  return await Conversation.find(query)
    .populate('user.userId')
    .populate('lastMessage');
};

export default {
  createConversation,
  retriveConversationByUserId,
  retriveConversationByConversationId,
  retriveConversations,
  searchConversation,
};
