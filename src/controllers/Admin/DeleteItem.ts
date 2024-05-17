import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import bcrypt from "bcrypt";
import { IndividualItem } from "../../models/Products/IndividualItem";

// delete an item for the admin only
// endpoint: /deleteitem
// DELETE
// payload: password, itemId

export const deleteItem = async (req: AuthRequest, res: Response) => {
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
        let { password, itemId } = req.body as {
          password: string;
          itemId: string;
        };

        if (!password || !itemId) {
          return res.status(400).json({ error: "Please fill all the fields" });
        }

        password = password.trim();
        itemId = itemId.trim();

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Wrong password" });
        }

        const item = await IndividualItem.findById(itemId);
        if (!item) {
          return res.status(404).json({ error: "Item not found" });
        }

        await item.deleteOne();
        return res.status(200).json({ message: "Item deleted successfully" });
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
