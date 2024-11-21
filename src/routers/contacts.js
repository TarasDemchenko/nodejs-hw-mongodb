import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactControllerById,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:id', ctrlWrapper(getContactControllerById));
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('contacts/:id', ctrlWrapper(patchContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactController));
export default router;
