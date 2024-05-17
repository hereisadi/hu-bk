import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualOrder } from "../../../models/Order/IndividualOrder";
import { sendEmail } from "../../../utils/EmailService";

// DELETE FOR ADMIN ONLY
// role: admin
// payload: orderId: string
// private

export const deleteOrder = async (req: AuthRequest, res: Response) => {
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
        const { orderId } = req.body as { orderId: string };
        if (!orderId) {
          return res.status(400).json({ error: "Please provide the orderId" });
        }

        const order = await IndividualOrder.findById(orderId);
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        await order.deleteOne();
        // send an email to the user that the order has been deleted
        sendEmail(
          order.customerEmail,
          "Your Order has been deleted",
          `Hello ${order.customerName}, Your order has been deleted by the shop owner. If you have any queries please contact the shop owner.\n Thank you.`
        );

        return res.status(200).json({ message: "Order deleted successfully" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
