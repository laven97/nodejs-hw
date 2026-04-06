import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, requered: true },
    accessTokenValidUntil: { type: Date, requered: true },
    refreshTokenValidUntil: { type: Date, requered: true },
  },
  {
    timestamps: true,
  },
);

export const Session = model('Session', sessionSchema);
