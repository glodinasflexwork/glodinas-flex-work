import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import profileRoutes from './routes/profile.routes.js';
import companyRoutes from './routes/company.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import savedJobsRoutes from './routes/savedJobs.routes.js';
import candidatesRoutes from './routes/candidates.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/candidates', candidatesRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io for real-time messaging
const userSockets = new Map<string, string>(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register', (userId: string) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Join conversation room
  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Send message
  socket.on('send_message', (data: {
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
  }) => {
    // Broadcast to all users in the conversation room
    io.to(data.conversationId).emit('new_message', data);
  });

  // Mark message as read
  socket.on('message_read', (data: { messageId: string; conversationId: string }) => {
    io.to(data.conversationId).emit('message_read', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io is ready for real-time connections`);
  });
}

export default app;
export { io };

