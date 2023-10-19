import { model, Schema } from 'mongoose';

export interface IUser extends Document {
  readonly _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}

export const User = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
});

export const UserModel = model<IUser>('User', User);
