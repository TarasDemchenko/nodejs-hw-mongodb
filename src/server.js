import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';
import dotenv from 'dotenv';
import { env } from '../src/utils/env.js';
dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.send({ status: 200, data: contacts });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.send({
      status: 200,
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// setupServer.get('/', (req, res) => {
//   res.send('hello')
// })

// app.use((req, res, next) => {
//   res.status(404).send({ status: 404, message: 'Route not found' });
// });

// app.use((error, req, res, next) => {
//   console.error(error);
//   res.status(500).send({ status: 500, message: 'Internl server error' });
// });
