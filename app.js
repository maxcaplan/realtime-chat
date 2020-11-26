const { v4: uuidv4 } = require("uuid");

// init express
const express = require("express");
const app = new express();
const port = process.env.PORT || 3000;

// init socket io
var http = require("http").createServer(app);
var io = require("socket.io")(http);

// init json db
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ messages: [] }).write();

let connected = 0;
let names = [];

// routing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/css/style.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/style.css");
});

app.get("/js/main.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/main.js");
});

// listen to socket io events
io.on("connection", (socket) => {
  connected++;
  console.log("a user connected. Users connected: " + connected);
  io.emit("connected-update", connected);
  io.emit("names-update", names);

  let name = false;
  socket.on("set-name", (val) => {
    const id = socket.id;

    name = { name: val, id: id };
    names.push(name);

    io.emit("names-update", names);
    io.to(id).emit("name-registered", name);
    io.to(id).emit("messages-update", db.get("messages"));
  });

  socket.on("disconnect", () => {
    connected--;
    console.log("user disconnected. Users connected: " + connected);

    if (name) {
      names = names.filter((x) => {
        return x.id != name.id;
      });
      io.emit("names-update", names);
    }

    io.emit("connected-update", connected);
  });

  socket.on("send-message", (val) => {
    console.log("Message received");
    const messages = db.get("messages");
    messages
      .push({
        name: val.name,
        id: val.id,
        message: val.message,
        timestamp: Date.now(),
      })
      .write();
    io.emit("messages-update", messages);
  });
});

// start server
http.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
