// export const registerUserController = async (req, res) => {
//   const user = await registerUser(req.body);

import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetPassword,
  resetPassword,
} from '../services/auth.js';

//   res.status(201).json({
//     status: 201,
//     message: 'Successfully registered a user!',
//     data: user,
//   });
// };

export const registerUserController = async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const user = await registerUser(payload);

  res.status(201).send({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const session = await loginUser(email, password);
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetPasswordController = async (req, res) => {
  const { email } = req.body;

  await requestResetPassword(email);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const ResetPasswordController = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
