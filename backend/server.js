const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const { initializeSocket } = require("./sockets/projectSockets");
const http = require("http");

dotenv.config({ path: './config.env' });

const app = express();
const server = http.createServer(app); // Use this server instance for both HTTP and WebSocket

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173', // Client origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Attach Socket.IO to the server
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Use server.listen, not app.listen
  console.log(`Server running on port ${PORT}`);
});
