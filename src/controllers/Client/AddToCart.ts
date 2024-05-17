import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualItem } from "../../models/Products/IndividualItem";

export const addToCart = async (req: AuthRequest, res: Response) => {
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
        const { itemId, quantity } = req.body as {
          itemId: string;
          quantity: string;
        };
        if (!itemId) {
          return res.status(400).json({ error: "Please provide the itemId" });
        }

        const item = await IndividualItem.findById(itemId);
        if (!item) {
          return res.status(404).json({ error: "Item not found" });
        }

        // add item to the user's cart
        user.cart.push({
          itemId: item._id,
          quantity,
          itemName: item.name,
          price: item.price,
          itemImage: item.image,
        });
        await user.save();
        return res.status(200).json({ message: "Item added to cart done" });
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
