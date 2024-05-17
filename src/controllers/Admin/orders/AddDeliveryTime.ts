import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualOrder } from "../../../models/Order/IndividualOrder";

export const addDeliveryTime = async (req: AuthRequest, res: Response) => {
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
        const { orderId, deliveryTime } = req.body as {
          orderId: string;
          deliveryTime: string;
        };
        if (!orderId) {
          return res.status(400).json({ error: "Please provide the orderId" });
        }
        if (!deliveryTime) {
          return res
            .status(400)
            .json({ error: "Please provide the deliveryTime" });
        }
        const thatOrder = await IndividualOrder.findById(orderId);
        if (!thatOrder) {
          return res.status(404).json({ error: "Order not found" });
        }
        thatOrder.deliveryTime = deliveryTime;
        await thatOrder.save();
        return res
          .status(200)
          .json({ message: "Delivery time added successfully" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
