import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualOrder } from "../../../models/Order/IndividualOrder";
import { notification } from "../../../models/Notification/notification";
import { eachAdminNotification } from "../../../utils/interfaces/adminNotification";
import { customSort } from "../../../utils/Sort/CustomSort";
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

        // getting all the noticications
        const allNotifications = await notification.find({});
        const adminData: eachAdminNotification[] = [];

        for (const notification of allNotifications) {
          if (notification.admin && Array.isArray(notification.admin)) {
            adminData.push(...notification.admin);
          }
        }

        const notificationsTime = adminData.map(
          (notification) => notification.time
        );

        const sortedNotificationsTime = customSort(notificationsTime, -1); // newest to oldest

        const allAdminNotification = sortedNotificationsTime.map((time: any) =>
          adminData.find((notification) => notification.time === time)
        );

        return res.status(200).json({
          message: "Orders fetched successfully",
          orders: allPendingOrders,
          notifications: allAdminNotification,
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
