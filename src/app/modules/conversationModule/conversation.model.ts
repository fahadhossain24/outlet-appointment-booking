import mongoose from 'mongoose';
import { IConversation } from './conversation.interface';

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    user:{
      name: {
        type: String,
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  'user.name': 'text'
})

const Conversation = mongoose.model<IConversation>('conversation', conversationSchema);
export default Conversation;
