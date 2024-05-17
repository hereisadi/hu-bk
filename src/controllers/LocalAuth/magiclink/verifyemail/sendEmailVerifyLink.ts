import { Response } from "express";
import { AuthRequest } from "../../../../utils/types/AuthRequest";
import { verifyToken } from "../../../../middlewares/VerifyToken";
import crypto from "crypto";
import { User } from "../../../../models/LocalAuth/User";
// import moment from "moment-timezone";
import { sendEmail } from "../../../../utils/EmailService";

export const sendEmailVerificationLink = async (
  req: AuthRequest,
  res: Response
) => {
  verifyToken(req, res, async () => {
    try {
      const userId = req.user?.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.isVerified === true) {
        return res.status(400).json({
          error: "Email already verified",
        });
      } else {
        const Email = user.email.trim();

        const token = crypto.randomBytes(48).toString("hex") as string;

        if (!token) {
          return res.status(400).json({ message: "token is missing" });
        }
        user.token = token;

        await user.save();
        const verifyEmailLink = `${
          process.env.website as string
        }/verifyemail/${token}`;

        sendEmail(
          Email,
          " Verify Email",
          `Click on this link to verify your email: ${verifyEmailLink} \n `
        );

        return res.status(200).json({
          success: true,
          message: "verification email sent sucessfully",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error", success: false });
    }
  });
};
