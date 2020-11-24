const { v4: uuidv4 } = require("uuid");

// init express
const express = require("express");
const app = new express();
const port = process.env.PORT || 3000;

// init socket io
var http = require("http").createServer(app);
var io = require("socket.io")(http);

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
    const id = uuidv4();

    name = { name: val, id: id };
    names.push(name);

    io.emit("names-update", names);
    io.emit("name-registered", name);
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
});

// start server
http.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
