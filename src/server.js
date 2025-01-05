import * as fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import 'dotenv/config';
import path from 'node:path';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
  );
  app.use(cors());
  app.use(cookieParser());
  app.use('/photo', express.static(path.resolve('src/public/avatars')));
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use('/', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
