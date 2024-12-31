// const { Server } = require("socket.io");
// const io = new Server(7000, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();

// io.on("connection", (socket) => {
//   console.log(`Socket connected`, socket.id);

//   //for joining into the room
//   socket.on("room:join", (data) => {
//     const { email, room } = data;
//     emailToSocketIdMap.set(email, socket.id);
//     socketidToEmailMap.set(socket.id, email);
//     //when joining into the room
//     io.to(room).emit("user:joined", { email, id: socket.id });
//     socket.join(room);

//     //accepting the joining request
//     io.to(socket.id).emit("room:join", data);
//   });

//   socket.on("user:call", ({ to, offer }) => {
//     io.to(to).emit("incomming:call", { from: socket.id, offer });
//   });

//   socket.on("call:accepted", ({ to, ans }) => {
//     io.to(to).emit("call:accepted", { from: socket.id, ans });
//   });
// });

const { Server } = require("socket.io");
const io = new Server(7000, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Handle joining a room
  socket.on("room:join", ({ email, room }) => {
    console.log(`${email} joined room: ${room}`);
    socket.join(room);

    // Notify the specific user that they've joined successfully
    io.to(socket.id).emit("room:join", { email, room });

    // Notify other users in the room
    socket.broadcast.to(room).emit("user:joined", { email, id: socket.id });
  });

  // Handle call offers
  socket.on("user:call", ({ to, offer }) => {
    console.log(`Forwarding call from ${socket.id} to ${to}`);
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  // Handle call answers
  socket.on("call:accepted", ({ to, ans }) => {
    console.log(`Call accepted by ${socket.id}, forwarding to ${to}`);
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ to, candidate }) => {
    console.log(`ICE candidate from ${socket.id} to ${to}`);
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

console.log("Socket.IO server running on port 7000");
