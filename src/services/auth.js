import crypto from 'node:crypto';

import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSessionUserId = async (userId) => {
  return Session.create({
    userId,
    accessTokem: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    accessTokenValidUntil: new Data(Data.now) + FIFTEEN_MINUTES,
    refreshTokenValidUntil: new Data(Data.now) + ONE_DAY,
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessTokem, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES,
  });
  res.cookie(refreshToken, session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};
