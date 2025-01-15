import { Server as SocketIOServer, Socket } from 'socket.io';
import { IConversation } from '../app/modules/conversationModule/conversation.interface';
import { IMessage } from '../app/modules/messageModule/message.interface';
import { ObjectId } from 'mongoose';

interface ConnectedUsers {
  [userId: string]: string; // Maps userId to socketId
}

interface ConnectedAdmins {
  [userId: string]: string; // Maps userId to socketId
}

class SocketManager {
  private static instance: SocketManager;
  private io!: SocketIOServer;
  private connectedUsers: ConnectedUsers = {};
  private activeAppUsers: string[] = [];
  //   private connectedAdmins: ConnectedAdmins = {};
  //   private activeAdmins: string[] = [];

  private constructor() {}

  // Singleton instance getter
  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  // Initialize the Socket.IO server
  init(io: SocketIOServer): void {
    this.io = io;

    io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      const userId = socket.handshake.query.userId as string | undefined;
      //   const adminId = socket.handshake.query.adminId as string | undefined;

      if (userId) {
        this.connectedUsers[userId] = socket.id;

        if (!this.activeAppUsers.includes(userId)) {
          this.activeAppUsers.push(userId);
        }
      }
      //   if (adminId) {
      //     this.connectedAdmins[adminId] = socket.id;

      //     if (!this.activeAdmins.includes(adminId)) {
      //       this.activeAdmins.push(adminId);
      //     }
      //   }

      console.log('connected users: ', this.connectedUsers);
      console.log('active users: ', this.activeAppUsers);
      //   console.log("connected Admins: ", this.connectedAdmins);
      //   console.log("active Admins: ", this.activeAdmins);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from connectedUsers and activeAppUsers
        for (const id in this.connectedUsers) {
          if (this.connectedUsers[id] === socket.id) {
            delete this.connectedUsers[id];
            const index = this.activeAppUsers.indexOf(id);
            if (index !== -1) {
              this.activeAppUsers.splice(index, 1);
            }
            break;
          }
        }
        console.log(this.connectedUsers);
        console.log(this.activeAppUsers);
      });
    });
  }

  // Join a user to a conversation room
  joinUser(conversation: Partial<IConversation>): void {
    if (!conversation._id || !conversation.user?.name) {
      console.warn('Invalid conversation data provided to joinUser in socket!');
      throw new Error('Invalid conversation data provided to joinUser in socket!');
    }

    const room = conversation._id.toString()
    const userId = conversation.user.userId;

    if (userId && this.connectedUsers[userId]) {
      const socketId = this.connectedUsers[userId];
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(room);
        console.log(`User ${conversation.user.name} joined conversation ${room}`);
      }
    } else {
      console.warn(`User ${conversation.user?.name || ''} is not connected`);
    }
  }

  // send and broadcast messages to all users in specific conversation
  sendMessage(conversationId: string | ObjectId, message: Partial<IMessage>): void {
    if (!conversationId || !message) {
      console.warn('Invalid message data provided to sendMessage function!');
      throw new Error('Invalid message data provided to sendMessage function!');
    }
  
    const roomId = conversationId.toString(); // Ensure roomId is a string
    const room = this.io.sockets.adapter.rooms.get(roomId);
  
    if (room && room.size > 0) { // Check if the room exists and has members
      this.io.to(roomId).emit('newMessage', message);
      console.log(`Message sent in conversation ${roomId}`);
      // Notify all admins globally
      this.io.emit('newMessageForAdmins', message);
    } else {
      console.warn(`Room ${roomId} does not exist or has no participants`);
    }
  }
}

export default SocketManager;
