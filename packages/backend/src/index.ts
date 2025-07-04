import express, { Request, Response, NextFunction } from 'express';
import badgeRoutes from './routes/badgeRoutes';
import certificateRoutes from './routes/certificateRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Placeholder for root
app.get('/', (req: Request, res: Response) => {
  res.send('Language Learning Web3 Backend');
});

app.use('/api/badges', badgeRoutes);
app.use('/api/certificates', certificateRoutes);

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Conditional server start to prevent issues in environments where listen might be problematic
if (process.env.NODE_ENV !== 'test') { // Example condition, adjust as needed
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app; // Export app for potential testing or programmatic use
