import mongoose, { Document } from "mongoose";

type IndividualOrderDocument = Document & {
  itemName: string;
  quantity: string;
  price: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  deliveryTime: string;
  orderedAt: string;
  isFinished: boolean;
};

const individualOrderSchema = new mongoose.Schema<IndividualOrderDocument>({
  itemName: String,
  quantity: String,
  price: String,
  customerName: String,
  customerEmail: String,
  customerAddress: String,
  customerPhone: String,
  deliveryTime: {
    type: String,
    default: "10",
  },
  orderedAt: String,
  isFinished: {
    type: Boolean,
    default: false,
  },
});

export const IndividualOrder = mongoose.model<IndividualOrderDocument>(
  "order",
  individualOrderSchema
);
