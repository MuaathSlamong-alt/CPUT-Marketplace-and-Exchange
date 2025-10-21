import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import chatRoutes from './routes/chat.js';

import ratingRoutes from './routes/rating.js';
import reportRoutes from './routes/report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
// Accept CORS from common Live Server origins
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5501',
  'http://localhost:5501'
];
const io = new SocketIO(server, { cors: { origin: allowedOrigins, methods: ['GET','POST'] } });

import pool from './models/db.js';
app.locals.db = pool;


// Enable CORS for API requests from Live Server (adjust origins if you use a different port)
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.static(path.join(__dirname, '../')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'cput-secret', resave: false, saveUninitialized: true }));

// Auth and feature routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', chatRoutes);

app.use('/', ratingRoutes);
app.use('/', reportRoutes);

// Placeholder routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../home/home.html'));
});

// Product submission page
app.get('/submit-product', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'product.html'));
});

// Notifications page
app.get('/notifications', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'notifications.html'));
});


// Socket.IO for real-time chat
io.on('connection', (socket) => {
  // Join a room for user-to-user chat
  socket.on('joinRoom', ({ userA, userB }) => {
    const room = [userA, userB].sort().join('-');
    socket.join(room);
  });
  // Handle sending a message
  socket.on('chatMessage', ({ fromUserId, toUserId, content }) => {
    const room = [fromUserId, toUserId].sort().join('-');
    io.to(room).emit('chatMessage', { fromUserId, toUserId, content });
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
