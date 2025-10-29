import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import todoRoutes from './routes/todoRoutes';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

app.use('/api/todos', todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
