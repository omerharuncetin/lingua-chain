import express, { Request, Response, NextFunction } from 'express';

// Import routers
import userRoutes from './routes/userRoutes';
import userProgressRoutes from './routes/userProgressRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import avatarRoutes from './routes/avatarRoutes';
import userAvatarRoutes from './routes/userAvatarRoutes';
import badgeRoutes from './routes/badgeRoutes'; // Contains both generic and user-specific logic
import certificateRoutes from './routes/certificateRoutes'; // Contains both generic and user-specific logic

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Language Learning Web3 Backend - API Running');
});

// --- API Routes ---

// User routes
app.use('/api/users', userRoutes);

// UserProgress routes (nested under users)
// The userRoutes does not directly use this, so we mount it here.
// The userProgressRoutes itself is set up with mergeParams: true
app.use('/api/users/:userId/progress', userProgressRoutes);

// Leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes);

// Avatar (marketplace item) routes
app.use('/api/avatars', avatarRoutes);

// UserAvatar (owned avatars) routes (nested under users)
app.use('/api/users/:userId/avatars', userAvatarRoutes);

// Badge routes
// Generic badge level info: /api/badges/:level
app.use('/api/badges', badgeRoutes);
// User-specific badges: /api/users/:userId/badges
app.use('/api/users/:userId/badges', badgeRoutes); // badgeRoutes is set up with mergeParams

// Certificate routes
// Generic certificate level info: /api/certificates/:level
app.use('/api/certificates', certificateRoutes);
// User-specific certificates: /api/users/:userId/certificates
app.use('/api/users/:userId/certificates', certificateRoutes); // certificateRoutes is set up with mergeParams


// Basic error handler (improved version can be added)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler caught an error:", err);
  if (res.headersSent) {
    return next(err); // Delegate to default Express error handler if headers already sent
  }
  res.status(500).json({ error: 'An unexpected error occurred on the server.' });
});

// Not found handler (should be last among routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: `The requested URL ${req.originalUrl} was not found on this server.` });
});


// Conditional server start
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Registered routes:');
    app._router.stack.forEach(function(r: any){
      if (r.route && r.route.path){
        console.log(Object.keys(r.route.methods).join(', ').toUpperCase() + '\t' + r.route.path);
      } else if (r.name === 'router') { // For sub-routers
        r.handle.stack.forEach(function(sub_r: any){
            if (sub_r.route && sub_r.route.path){
                 // Path might be relative to the sub-router's mount point
                 // For simplicity, just logging the sub-path
                 console.log(Object.keys(sub_r.route.methods).join(', ').toUpperCase() + '\t' + (r.regexp.source.replace(/\\\/\?\(\?=\\\/\|\$\)/, '').replace('^\\/', '/') + sub_r.route.path.substring(1)).replace(/\\/g, ''));
            }
        });
      }
    });
  });
}

export default app;
