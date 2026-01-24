import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRouter from './routes/auth.js';
import generateRouter from './routes/generate.js';
import imagesRouter from './routes/images.js';
import debugRouter from './routes/debug.js';

// Load environment variables from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/generate', generateRouter);
app.use('/api/images', imagesRouter);
app.use('/api/debug', debugRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
