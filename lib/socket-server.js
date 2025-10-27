import { Server } from 'socket.io';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { connectDB, Message } from './index.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await connectDB();
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: process.env.NEXTAUTH_URL || "http://localhost:3000", methods: ["GET", "POST"] }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-project', (projectId) => {
      socket.join(projectId);
    });

    socket.on('send-message', async (data) => {
      try {
        const message = new Message(data);
        await message.save();
        io.to(data.projectId).emit('receive-message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Socket server ready on http://localhost:3001');
  });
});
