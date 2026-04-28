import { Server } from 'socket.io';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';

let io;

// Initialize Socket.IO
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // ⚠️ change to your frontend URL in production
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // =========================
        // JOIN EVENT
        // =========================
        socket.on('join', async ( data ) => {
            try {
                const { userType, userId } = data;


                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, {
                        socketId: socket.id
                    });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, {
                        socketId: socket.id
                    });
                }

            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: 'Join failed' });
            }
        });

        // =========================
        // UPDATE CAPTAIN LOCATION
        // =========================
       socket.on('update-location-captain', async (data) => {
            try {
                const { userId,location} = data;

                if(!location || !location.ltd || !location.lng){
                    return socket.emit("error",{message:"Invalid location data"})
                }
                await captainModel.findByIdAndUpdate(userId, {
                    location:{
                        ltd:location.ltd,
                        lng:location.lng
                    }
                });
            } catch (error) {
                console.error('Location update error:', error);
            }
        });

        // =========================
        // DISCONNECT
        // =========================
        socket.on('disconnect', async () => {
            try {
                console.log(`Client disconnected: ${socket.id}`);

                await userModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null }
                );

                await captainModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null }
                );

            } catch (error) {
                console.error('Disconnect cleanup error:', error);
            }
        });
    });
};

// =========================
// SEND MESSAGE TO SOCKET
// =========================
export const sendMessageToSocketId = (socketId, messageObject) => {
    try {
        if (!io) {
            return console.log('Socket.io not initialized');
        }

        if (!socketId) {
            return console.log('No socketId provided');
        }
       
io.to(socketId).emit(messageObject.event, messageObject.data);

    } catch (error) {
        console.error('Emit error:', error);
    }
};

export default {
    initializeSocket,
    sendMessageToSocketId
};