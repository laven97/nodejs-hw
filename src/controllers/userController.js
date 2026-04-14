import createHttpError from 'http-errors';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user_id);

  const uploadUser = await User.findByIdAndUpdate(
    { _id: req.user_id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );
  res.status(200).json({ url: uploadUser.avatar });
};
