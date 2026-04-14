import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'path';

import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(200, {
      message: 'Password reset email sent successfully',
    });
  }

  const resetToken = jwt.sign({ sub: user_id, email }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const frontendURL = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

  const temlatesPath = path.join(
    process.cwd(),
    'src',
    'templates',
    'resetPasswordEmail.html',
  );

  const templateSource = await fs.reafFile(temlatesPath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  const html = template({
    name: user.username || user.email,
    link: frontendURL,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Resey password',
      html,
    });
  } catch (e) {
    throw createHttpError(
      500,
      "'Failed to send the email, please try again later.'.",
    );
  }

  res.status(200).json({ message: 'Password reset email sent successfully' });
};

export const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await User.findById({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashPassword });

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({ message: 'Password reset successfully' });
};
