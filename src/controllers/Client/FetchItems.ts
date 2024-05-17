import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualItem } from "../../models/Products/IndividualItem";
import { notification } from "../../models/Notification/notification";
import { eachClientNotification } from "../../utils/interfaces/studentNotification";
import { customSort } from "../../utils/Sort/CustomSort";

// fetch items and categories for the client and admin
// role: client and admin
// private
// GET /fetchitems

export const fetchItems = async (req: AuthRequest, res: Response) => {
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

      if (user.role === "client" || user.role === "admin") {
        // all items irrespective of the category and availability
        // in client dev can filter the items based on the category, availability and isStarred
        const allItems = await IndividualItem.find();

        // find category
        const allCategories: string[] = [];
        for (let i = 0; i < allItems.length; i++) {
          const item = allItems[i];
          if (!allCategories.includes(item.category)) {
            allCategories.push(item.category);
          }
        }

        // getting all the noticications
        const allNotifications = await notification.find({});
        const clientData: eachClientNotification[] = [];

        for (const notification of allNotifications) {
          if (notification.client && Array.isArray(notification.client)) {
            clientData.push(...notification.client);
          }
        }

        const filteredClientNotificationsUnsorted = clientData.filter(
          (clientData) => {
            return clientData.email === user.email;
          }
        );

        const notificationsTime = filteredClientNotificationsUnsorted.map(
          (notification) => notification.time
        );

        const sortedNotificationsTime = customSort(notificationsTime, -1); // newest to oldest

        const allClientNotifications = sortedNotificationsTime.map(
          (time: any) =>
            filteredClientNotificationsUnsorted.find(
              (notification) => notification.time === time
            )
        );

        return res.status(200).json({
          message: "Items fetched successfully",
          items: allItems,
          notifications: allClientNotifications,
          category: allCategories,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
