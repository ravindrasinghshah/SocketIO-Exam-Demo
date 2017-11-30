const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

// configure folder to serve files
app.use(express.static(__dirname + '/app'));

function onConnection(socket){

    // register socket function event
  socket.on('AskQuestion', function(msg){ 
    io.emit('AskQuestion', msg);
  });
  socket.on('AnsQuestion', function(msg){ 
    io.emit('AnsQuestion', msg);
  });
  socket.on('ShowAnswer', function(msg){ 
    io.emit('ShowAnswer', msg);
  });
  socket.on('SendNote', function(msg){ 
    io.emit('SendNote', msg);
  });
}

// Bind function with connection
io.on('connection', onConnection);
// open port
http.listen(port, () => console.log('listening on port ' + port));