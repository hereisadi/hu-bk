import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualOrder } from "../../../models/Order/IndividualOrder";
import { notification } from "../../../models/Notification/notification";

// todo: remove the order from db after it has been marked as done, and add that order in a spreadsheet to track the orders that have been completed

export const markOrderAsDone = async (req: AuthRequest, res: Response) => {
  verifyToken(req, res, async () => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "admin") {
        const { orderId, currentTime, otherId } = req.body as {
          orderId: string;
          currentTime: string;
          otherId: string;
        };
        if (!orderId || !otherId) {
          return res.status(400).json({ error: "Please provide the orderId" });
        }
        const thatOrder = await IndividualOrder.findById(orderId);
        if (!thatOrder) {
          return res.status(404).json({ error: "Order not found" });
        }
        if (!currentTime) {
          return res
            .status(400)
            .json({ error: "Please provide the current time" });
        }
        if (thatOrder.isFinished === false) {
          thatOrder.isFinished = true;
          thatOrder.orderedMarkedAtFinishedTime = currentTime;
          await thatOrder.save();

          const thatNotification = await notification.findOne({
            otherId: otherId,
          });
          if (!thatNotification) {
            return res.status(404).json({ error: "Notification not found" });
          }
          thatNotification.client.push({
            title: "Order marked as done",
            desc: `Your order has been marked as done by the shop owner. Thank you for shopping with us.`,
            time: currentTime,
            email: thatOrder.customerEmail,
          });
          await thatNotification.save();

          return res
            .status(200)
            .json({ message: "Order marked as done successfully" });
        } else {
          return res
            .status(400)
            .json({ error: "Order is already marked as done" });
        }
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
