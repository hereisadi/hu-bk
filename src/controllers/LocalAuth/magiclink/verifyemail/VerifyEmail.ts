import { Request, Response } from "express";
import { User } from "../../../../models/LocalAuth/User";
// import moment from "moment-timezone";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const user = await User.findOne({
      token,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    user.token = undefined;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", success: false });
  }
};
