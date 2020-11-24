// init express
const express = require("express");
const app = new express();
const port = process.env.PORT || 3000;

// init socket io
var http = require("http").createServer(app);
var io = require("socket.io")(http);

let connected = 0;

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

  socket.on("disconnect", () => {
    connected--;
    console.log("user disconnected. Users connected: " + connected);

    io.emit("connected-update", connected);
  });
});

// start server
http.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
