// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/json', (req, res) => {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
});

app.get('/echo', (req, res) => {
    const input = req.query.input;
    const response = {
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    };
    res.json(response);
});

app.use(express.static(path.join(__dirname, 'mychat')));


app.get('/chat', (req, res) => {
    const message = req.query.message;
    io.emit('message', message);
    res.send('Message sent to chat: ' + message);
});

app.get('/sse', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    io.on('connection', (socket) => {
        socket.on('message', (data) => {
            res.write(`data: ${data}\n\n`);
        });
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});