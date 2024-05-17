import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { IndividualItem } from "../../models/Products/IndividualItem";

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
        return res
          .status(200)
          .json({
            message: "Items fetched successfully",
            items: allItems,
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
