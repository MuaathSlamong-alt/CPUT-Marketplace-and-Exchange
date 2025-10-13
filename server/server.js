import reportRoutes from './routes/report.js';
app.use('/', reportRoutes);
import ratingRoutes from './routes/rating.js';
app.use('/', ratingRoutes);
import adminRoutes from './routes/admin.js';
app.use('/', adminRoutes);
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import chatRoutes from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);


app.use(express.static(path.join(__dirname, '../')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'cput-secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', chatRoutes);

// Placeholder routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../home/home.html'));
});

// TODO: Add authentication, product, admin, chat routes


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
