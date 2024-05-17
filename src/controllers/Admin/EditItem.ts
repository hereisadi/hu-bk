import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualItem } from "../../models/Products/IndividualItem";

// for the admin only
// endpoint: /edititem
// PUT
// payload: name, description, price, stock, category, image, itemId and isStarred
// private

export const editItem = async (req: AuthRequest, res: Response) => {
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
        let { name, description, price, stock, category, image } = req.body as {
          name: string;
          description: string;
          price: string;
          stock: string;
          category: string;
          image: string;
        };
        const isStarred = req.body;
        const itemId = req.body;

        const item = await IndividualItem.findById(itemId);
        if (!item) {
          return res.status(404).json({ error: "Item not found" });
        }

        name = name?.trim();
        description = description?.trim();
        category = category?.trim().toLowerCase();
        price = price?.trim();
        stock = stock?.trim();
        image = image?.trim();

        if (name && item.name !== name) {
          item.name = name;
        }

        if (description && item.description !== description) {
          item.description = description;
        }

        if (category && item.category !== category) {
          item.category = category;
        }

        if (price && item.price !== price) {
          item.price = price;
        }

        if (stock && item.stock !== stock) {
          item.stock = stock;
        }

        if (image && item.image !== image) {
          item.image = image;
        }

        if (isStarred !== undefined && item.isStarred !== isStarred) {
          item.isStarred = isStarred;
        }

        await item.save();

        return res.status(200).json({ message: "Item added successfully" });
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
