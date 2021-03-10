module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("a user has connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("chat message", (msg) => {
      console.log("not here....");
      io.emit("chat message", msg);
    });
  });
};
