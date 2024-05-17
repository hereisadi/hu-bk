import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualItem } from "../../models/Products/IndividualItem";

// for the admin only
// endpoint: /additem
// POST
// payload: name, description, price, stock, category, image and isStarred
// private

export const addItem = async (req: AuthRequest, res: Response) => {
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
        if (
          !name ||
          !description ||
          !price ||
          !stock ||
          !category ||
          !image ||
          isStarred === undefined
        ) {
          return res.status(400).json({ error: "Please fill all the fields" });
        }

        name = name.trim();
        description = description.trim();
        category = category.trim().toLowerCase();
        price = price.trim();
        stock = stock.trim();
        image = image.trim();

        const item = new IndividualItem({
          name,
          description,
          price,
          stock,
          category,
          image,
          isStarred,
        });

        await item.save();
        return res.status(200).json({ message: "Item added successfully" });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (err) {
      console.error("something went wrong on the server side");
      return res
        .status(500)
        .json({ error: "something went wrong on the server side" });
    }
  });
};
