import mongoose, { Document } from "mongoose";

type notificationDocument = Document & {
  otherId: string;
  admin: [
    {
      title: string;
      desc: string;
      time: string;
    }
  ];
  client: [
    {
      title: string;
      desc: string;
      time: string;
      email: string;
    }
  ];
};

const notificationSchema = new mongoose.Schema<notificationDocument>({
  otherId: String,
  admin: [
    {
      title: String,
      desc: String,
      time: String,
    },
  ],
  client: [
    {
      title: String,
      desc: String,
      time: String,
      email: String,
    },
  ],
});

export const notification = mongoose.model<notificationDocument>(
  "Notification",
  notificationSchema
);
