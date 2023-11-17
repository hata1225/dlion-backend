import express from 'express';
import todoRoutes from './routes/todoRoutes';

const app = express();
app.use(express.json());
app.use('/todos', todoRoutes);

export default app;