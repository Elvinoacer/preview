import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  socket.on("user_typing", (data) => {
    socket.broadcast.to(data.room).emit("user_typing", data);
  });
  socket.on("leave-room", (room) => {
    socket.leave(room);
    io.to(room).emit("user-disconnected", socket.id);
  });
  socket.on("join-room", (data) => {
    socket.join(data.room);
    console.log(data);
    io.to(data.room).emit("user-connected", data.user);
    socket.on("disconnect", () => {
      io.to(data.room).emit("user-disconnected", data.user);
    });
  });
  socket.on("send_message", (message, room) => {
    fetch("http://localhost:3000/api/universities/chats/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    socket.broadcast.to(room).emit("recieve_message", message);
  
  });


});
