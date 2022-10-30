const express = require('express')
const fs = require("fs");
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const port = process.env.PORT || 30000;
app.set('view engine', 'ejs');
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
})


app.use('/peerjs', peerServer) // the url to be used for peer server 
app.use(express.static('pub'));
//specifies the public files(accessible through browser by users) would live in the dir:pub !

function create_UUID() {

    return Math.random()*5000;
  };
 //unique rand url generator
let uuid = create_UUID();

app.get('/', (req, res) => {
  res.redirect(`/${uuid}`)
}) // redrirects to the url generated
app.get('/:view', (req, res) => {
  res.status(200);
  res.render('view', { viewId: req.params.view });
})
//creating the room
io.on('connection', socket => {
  socket.on('join-room', (roomid, userid) => {
    console.log("Yea you made it to the room!")
    socket.join(roomid)
    socket.to(roomid).emit('user-connected', userid);

    socket.on('message', (message,user_name) => {
      //send message to the same room
      io.to(roomid).emit('createMessage', message,user_name)
    }); 
  })
})



// we also have to listen to a server, or else the server won't run:
server.listen(port, () => {
  console.log(`Server listens on port: ${port}`);
});
