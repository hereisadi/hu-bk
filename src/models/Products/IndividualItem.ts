import mongoose, { Document } from "mongoose";

type IndividualItemDocument = Document & {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
  isStarred: boolean;
  isAvailableForSale: boolean;
};

const individualItemSchema = new mongoose.Schema<IndividualItemDocument>({
  name: String,
  description: String,
  price: String,
  stock: String,
  category: String,
  image: String,
  isStarred: Boolean,
  isAvailableForSale: {
    type: Boolean,
    default: true,
  },
});

export const IndividualItem = mongoose.model<IndividualItemDocument>(
  "item",
  individualItemSchema
);
