import { Server } from "socket.io";

var socketIO = "";

export const createSocketServer = (serverInstance) => {
  socketIO = new Server(serverInstance, { cors: { origin: "*" } });

  
  socketIO.on('connection', (socket) => {
      socket.on('CREATEROOM', (data) => {
          if(data.user){
              socket.join(data.user)
            }
        })
        socket.on('join-custom-room', data => {
            socket.join(data)
        })
    })
    
};

export const emitToRoom = (room, data) => {
    socketIO.sockets.in(room).emit('message',data)
}

export { socketIO };
