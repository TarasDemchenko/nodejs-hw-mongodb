import createHttpError from 'http-errors';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as fs from 'node:fs';
import path from 'node:path';
import handlebars from 'handlebars';
import { UsersCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'utf-8' },
);

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await UsersCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await SessionCollection.deleteOne({ userId: user._id });
  return await SessionCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 30 * 60 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findById(sessionId);
  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is expired ');
  }
  await SessionCollection.deleteOne({ _id: session._id });

  return SessionCollection.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 30 * 60 * 60 * 1000),
  });
};

export const requestResetPassword = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found ');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);
  await sendEmail({
    from: 'tarasdemchenko1993@gmail.com',
    to: user.email,
    subject: 'Reset password',
    html: html({ resetToken }),
  });

  // console.log(`https://localhost:3000/reset-password?token=${resetToken}`);
};

export const resetPassword = async (newPassword, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, 'User not found ');
    }
    const hasheadPassword = await bcrypt.hash(newPassword, 10);
    await UsersCollection.findByIdAndUpdate(user._id, {
      password: hasheadPassword,
    });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    console.error(error);
    throw error;
  }
};
