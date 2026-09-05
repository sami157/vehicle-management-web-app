import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { requireFirebaseAuth } from './middleware/auth.ts';

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('This is the server for CPGCBL Fleet Management');
});

app.use('/api', requireFirebaseAuth);

app.get('/api/auth/me', (req: Request, res: Response) => {
  if (!req.auth) {
    res.status(401).json({ error: 'unauthorized', message: 'Authentication is required.' });
    return;
  }

  const { token, user } = req.auth;
  res.json({
    user,
    firebase: {
      uid: token.uid,
      email: token.email ?? null,
      name: token.name ?? null,
    },
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled request error:', error);
  res.status(500).json({ error: 'internal_server_error', message: 'An unexpected server error occurred.' });
});

app.listen(5001, () => {
  console.log('Fleet management server is running');
});
