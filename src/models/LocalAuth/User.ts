import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  deleteAccount: boolean;
  token: string | undefined;
  tokenExpiresAt: string | undefined;
  isVerified: boolean;
  is2faEnabled: boolean;
  accountCreatedAt: string;
  cart: {
    itemId: string;
    quantity: string;
    itemName: string;
    price: string;
    itemImage: string;
  }[];
};

const userSchema = new mongoose.Schema<UserDocument>({
  name: String,
  phone: String,
  address: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  accountCreatedAt: String,
  cart: [
    {
      itemId: String,
      quantity: String,
      itemName: String,
      price: String,
      itemImage: String,
    },
  ],
  role: {
    type: String,
    required: true,
    default: "client",
  },
  password: {
    type: String,
    required: true,
  },
  deleteAccount: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: undefined,
  },
  tokenExpiresAt: {
    type: String,
    default: undefined,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  is2faEnabled: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model<UserDocument>(
  "localAuthenticationSignup",
  userSchema
);
