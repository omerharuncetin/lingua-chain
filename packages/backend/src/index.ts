import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config'
import cors from 'cors';

// Import routers
import userRoutes from './routes/userRoutes';
import userProgressRoutes from './routes/userProgressRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import avatarRoutes from './routes/avatarRoutes';
import userAvatarRoutes from './routes/userAvatarRoutes';
import badgeRoutes from './routes/badgeRoutes'; // Contains both generic and user-specific logic
import certificateRoutes from './routes/certificateRoutes'; // Contains both generic and user-specific logic
import nftMetadataRoutes from './routes/nftMetadataRoutes'; // New routes for NFT metadata
import dailyLessonRoutes from './routes/dailyLessonRoutes'; // New routes for NFT metadata

// Import services
import { initializeSbtListeners } from './services/sbtListenerService'; // New SBT Listener Service
import { seedAvatars } from './seed';
import { initializeMarketplaceListener } from './services/marketplaceListenerService';

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Middleware to serve static files from the 'public' directory
// This will allow access to files like http://localhost:3001/images/nfts/badges/a1.png
app.use(express.static('public'));

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Language Learning Web3 Backend - API Running');
});

// --- API Routes ---

async function main() {
  await seedAvatars()
}

main();

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

// Daily lessons
app.use('/api/daily-lessons', dailyLessonRoutes);

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

// NFT Metadata routes (for token URIs)
app.use('/api/nft', nftMetadataRoutes);

app.get('/health', (req, res) => {
  res.status(200);
})


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
    // Simple route logging (can be made more sophisticated)
    app._router.stack.forEach(function (r: any) {
      if (r.route && r.route.path) {
        console.log(Object.keys(r.route.methods).join(', ').toUpperCase() + '\t' + r.route.path);
      } else if (r.name === 'router' && r.handle.stack) {
        r.handle.stack.forEach(function (sub_r: any) {
          if (sub_r.route && sub_r.route.path) {
            let basePath = r.regexp.source.replace('^\\', '').replace('\\/?(?=\\/|$)', '').replace(/\\/g, '');
            if (basePath.endsWith('/')) basePath = basePath.slice(0, -1);
            if (basePath === "?(.*)") basePath = ""; // Ignore base for wildcard router if not more specific

            console.log(Object.keys(sub_r.route.methods).join(', ').toUpperCase() + '\t' + basePath + sub_r.route.path);
          }
        });
      }
    });

    // Initialize Listeners after server starts (or before, depending on preference)
    console.log("Initializing contract listeners...");
    initializeSbtListeners();
    initializeMarketplaceListener();
  });
}

export default app;
