# Real-Time Chat Application

## Server Side (server.js):

### Dependencies
- Express.js: A web application framework for Node.js.
- http: Node.js built-in module for creating an HTTP server.
- path: Node.js built-in module for handling file paths.
- socket.io: A library for real-time web applications, providing bidirectional communication between the client and the server.

### Server Setup
1. Create an Express application and an HTTP server.
2. Initialize Socket.IO on the server.

```javascript
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
```
Set the port for the server: const port = process.env.PORT || 3000;

## Routes

### Default Route ('/')
Responds with a plain text message 'hi'.

```javascript
app.get('/', (req, res) => {
    res.send('hi');
});
```

### JSON Route('/json')

Responds with a JSON object containing a text property set to 'hi' and a numbers property set to an array [1, 2, 3].

```javascript
app.get('/json', (req, res) => {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
});
```
### Echo Route ('/echo')

Echoes back the input query parameter in various formats (normal, shouty, character count, and backwards).

```javascript
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
```

### Static Files Route ('/static/*')
Serves static files from the 'mychat' directory.
```javascript
app.use(express.static(path.join(__dirname, 'mychat')));
```

### Chat Route ('/chat')
Emits a 'message' event with the message from the query parameter.
Responds with a message indicating that the message has been sent to the chat.

```javascript
app.get('/chat', (req, res) => {
    const message = req.query.message;
    io.emit('message', message);
    res.send('Message sent to chat: ' + message);
});
```

### Server-Sent Events (SSE) Route ('/sse')
Establishes an SSE connection and sends messages in real-time to the client.

```javascript
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

// Server listens on the specified port
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

## Client Side (chat.html and chat.js):
### HTML File (chat.html)
Creates an HTML file with a form containing an input field for sending messages and a div for displaying chat messages.
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real-Time Chat</title>
</head>

<body>
    <div id="messages"></div>
    <form id="messageForm">
        <input type="text" id="messageInput" placeholder="Type your message">
        <button type="submit">Send</button>
    </form>

    <script src="/socket.io/socket.io.js"></script>
    <script src="chat.js"></script>
</body>

</html>
```
### JavaScript File (chat.js)
Establishes a Server-Sent Events (SSE) connection to '/sse'.
Appends incoming messages to the div with the id "messages".
Submits messages to the server when the form is submitted.
Clears the input field after submitting a message.
```javascript
const socket = io('/sse');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

socket.on('message', (message) => {
    appendMessage(message);
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('message', message);
    appendMessage(message);
    messageInput.value = '';
});
```

This Real-Time Chat Application demonstrates various functionalities, including sending messages, handling JSON responses, and establishing real-time communication using Server-Sent Events (SSE) and Socket.IO.

