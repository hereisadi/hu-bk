import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualOrder } from "../../models/Order/IndividualOrder";
import { eachOrder } from "../../utils/interfaces/order";
import { uniqueid } from "../../utils/createUniqueId";
import { notification } from "../../models/Notification/notification";

// POST to place an order
// role: client
// payload: items: eachOrder[], currentTime: string
// private
// /placeorder

export const placeOrder = async (req: AuthRequest, res: Response) => {
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

      if (user.role === "client") {
        const randomGeneratedID = uniqueid;
        const { items, currentTime } = req.body as {
          items: eachOrder[];
          currentTime: string;
        };
        if (items.length === 0) {
          return res
            .status(400)
            .json({ error: "item length should be greater than 0" });
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const saveItem = new IndividualOrder({
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
            customerName: user.name,
            customerEmail: user.email,
            // while placing the order user can provide the custom address, if not provided then use the address from the user's account. By deafult it will be the user's address
            customerAddress: item.customerAddress,
            customerPhone: user.phone,
            orderedAt: currentTime,
            otherId: randomGeneratedID,
          });
          await saveItem.save();
        }

        const notificationReg = new notification({
          otherId: randomGeneratedID,
        });
        await notificationReg.save();

        // save one notification for the admin
        const newNotificationForTheAdmin = {
          title: "New Order Placed",
          desc: `${user.name}  with the mobile number ${user.phone} has placed an order`,
          time: currentTime,
        };
        const adminNotification = await notification.findOne({
          otherId: randomGeneratedID,
        });
        adminNotification?.admin.push(newNotificationForTheAdmin);
        await adminNotification?.save();

        return res.status(200).json({ message: "Order placed successfully" });
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
