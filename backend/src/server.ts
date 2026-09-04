import express, { type Express, type Request, type Response } from 'express';
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('This is the server for CPGCBL Fleet Management');
});

app.listen(5001, () => {
  console.log('Fleet management server is running')
});