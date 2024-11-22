import { Router } from 'express';
import express from 'express';
import {
  createContactController,
  deleteContactController,
  getContactControllerById,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:id', ctrlWrapper(getContactControllerById));
router.post('/contacts', jsonParser, ctrlWrapper(createContactController));
router.patch('/contacts/:id', jsonParser, ctrlWrapper(patchContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactController));
export default router;
