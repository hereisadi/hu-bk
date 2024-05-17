import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualOrder } from "../../../models/Order/IndividualOrder";

// GET /orders for the admin only

export const fetchOrders = async (req: AuthRequest, res: Response) => {
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
        const allPendingOrders = await IndividualOrder.find({
          isFinished: false,
        });
        return res
          .status(200)
          .json({
            message: "Orders fetched successfully",
            orders: allPendingOrders,
          });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
