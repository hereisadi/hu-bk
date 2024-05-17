import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";

// POST to remove an item from the cart
// role: client
// payload: itemId: string
// private
// /removefromcart

export const removeFromCart = async (req: AuthRequest, res: Response) => {
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
        const { itemId } = req.body as { itemId: string };
        if (!itemId) {
          return res.status(400).json({ error: "Please provide the itemId" });
        }
        const allItemsStoredInTheCart = user.cart;
        if (allItemsStoredInTheCart.length === 0) {
          return res.status(400).json({ error: "Cart is empty" });
        }
        const updatedCart = allItemsStoredInTheCart.filter(
          (item) => item.itemId !== itemId
        );
        user.cart = updatedCart;
        await user.save();
        return res
          .status(200)
          .json({ message: "Item removed from cart successfully" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the server side" });
    }
  });
};
