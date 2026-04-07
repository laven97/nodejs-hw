import { Session } from '../models/session';
import { User } from '../models/user';

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findOne(session.userId);
  if (!user) {
    throw createHttpError(401);
  }

  req.user = user;

  next();
};
