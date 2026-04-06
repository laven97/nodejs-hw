import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, requered: true},
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function () {
  if (!username) {
    this.username = this.email;
  }
});

userSchema.method.toJSON = function (){
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

export const User = model('User', userSchema);
