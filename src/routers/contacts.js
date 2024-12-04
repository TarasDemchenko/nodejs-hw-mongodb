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
import { isValidId } from '../middlewares/isValidId.js';

import { validateBody } from '../middlewares/validateBody.js';
import {
  changeContactSchema,
  createContactSchema,
} from '../validation/contacts.js';

const router = Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:id', isValidId, ctrlWrapper(getContactControllerById));
router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:id',
  isValidId,
  jsonParser,
  validateBody(changeContactSchema),
  ctrlWrapper(patchContactController),
);
router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));
export default router;
