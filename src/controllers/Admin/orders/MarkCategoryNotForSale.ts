import { Response } from "express";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { IndividualItem } from "../../../models/Products/IndividualItem";

// TOGGLE ITEM'S AVAILABILITY FOR SALE FOR ADMIN ONLY
// role: admin
// payload: category: string
// private
// PUT  /toggleavailabilityforsale

export const toggleAvailabilityForSale = async (
  req: AuthRequest,
  res: Response
) => {
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
        let { category } = req.body as { category: string };
        if (!category) {
          return res.status(400).json({ error: "Please provide the category" });
        }
        category = category.trim().toLowerCase();

        const allItemsWithThatCategory = await IndividualItem.find({
          category: category,
        });
        if (allItemsWithThatCategory.length === 0) {
          return res
            .status(404)
            .json({ error: "No items found with that category" });
        }

        for (let i = 0; i < allItemsWithThatCategory.length; i++) {
          const item = allItemsWithThatCategory[i];
          item.isAvailableForSale = !item.isAvailableForSale;
          await item.save();
        }

        return res
          .status(200)
          .json({
            message: "Category availability for sale toggled successfully",
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
