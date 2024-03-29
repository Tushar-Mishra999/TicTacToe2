// importing modules
const { Console } = require("console");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const Room = require("./models/room");
var io = require("socket.io")(server);

// middle ware
app.use(express.json());

const DB =
  "mongodb+srv://Tushar:Tushar1612@cluster0.izmxq7y.mongodb.net/?retryWrites=true&w=majority";

io.on("connection", (socket) => {
  socket.on("createRoom", async ({ nickname }) => {
    try {
      // room is created 
      let room = new Room();
      let player = {
        socketID: socket.id,
        nickname,
        playerType: "X",
      };
      await room.players.push(player);
      room.turn = player;
      room = await room.save();
      const roomId = room._id.toString();

      await socket.join(roomId);
      // io -> send data to everyone
      // socket -> sending data to yourself
      console.log('room created');
      await io.to(roomId).emit("createRoomSuccess", room);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("joinRoom", async ({ nickname, roomId }) => {
    try {
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        await socket.emit("errorOccurred", "Please enter a valid room ID.");
        return;
      }
      let room = await Room.findById(roomId);

      if (room.isJoin) {
        let player = {
          nickname,
          socketID: socket.id,
          playerType: "O",
        };
        await socket.join(roomId);
        await room.players.push(player);
        room.isJoin = false;
        room = await room.save();
        console.log('2nd player joins');
        await io.to(roomId).emit("updatePlayers", room.players);
        await io.to(roomId).emit("joinRoomSuccess", room);
        await io.to(roomId).emit("updateRoom", room);
      } else {
        await socket.emit(
          "errorOccurred",
          "The game is in progress, try again later."
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("tap", async ({ index, roomId }) => {
    try {
      let room = await Room.findById(roomId);

      let choice = room.turn.playerType; // x or o
      if (room.turnIndex == 0) {
        room.turn = room.players[1];
        room.turnIndex = 1;
      } else {
        room.turn = room.players[0];
        room.turnIndex = 0;
      }
      room = await room.save();
      await io.to(roomId).emit("tapped", {
        index,
        choice,
        room,
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("winner", async ({ winnerSocketId, roomId }) => {
    try {
      if(socket.id!=winnerSocketId){return ;}
      let room = await Room.findById(roomId);
      let player = room.players.find(
        (playerr) => playerr.socketID == winnerSocketId
      );
      player.points += 1;
      room = await room.save();

      if (player.points >= room.maxRounds) {
        await io.to(roomId).emit("endGame", player);
      } else {
        await io.to(roomId).emit("pointIncrease", player);
      }
    } catch (e) {
      console.log(e);
    }
  });
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((e) => {
    console.log(e);
  });

server.listen(port, "0.0.0.0", () => {
  console.log(`Server started and running on port ${port}`);
});
