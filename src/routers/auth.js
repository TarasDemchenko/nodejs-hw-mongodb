import express from 'express';
import {
  loginrUserSchema,
  registerUserSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetPasswordController,
  ResetPasswordController,
} from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginrUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);
router.post(
  '/reset-password',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(ResetPasswordController),
);

export default router;
