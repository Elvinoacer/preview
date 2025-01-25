const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

console.log("Starting");

io.on("connection", (socket) => {
  socket.on("send_message", (msg, userRoom) => {
    console.log("send_message", msg, userRoom);
    socket.to(userRoom).emit("recieve_message", msg);
    fetch("http://localhost:3000/api/universities/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  });

  socket.on("user_typing", (data) => {
    console.log("user_typing", data);
    socket.to(data.room).emit("user_typing", data);
  });

  socket.on("new_user", (data) => {
    console.log("new_user", data);
    socket.join(data.room);
    socket.to(data.room).emit("new_user", data.user);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
