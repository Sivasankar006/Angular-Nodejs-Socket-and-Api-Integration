const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../Nodejs/src/db')
const router = require("./src/Routes/routes");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// socketio your routes
app.set('socketio', io);
app.use("/api", router);


// Listen socket connections
io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


module.exports = express();
module.exports = { io: io };
  
