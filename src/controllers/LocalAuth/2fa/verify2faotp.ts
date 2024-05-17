import { Request, Response } from "express";
import { twoFA } from "../../../models/LocalAuth/2faotp/otp";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
import { User } from "../../../models/LocalAuth/User";
import { CSuccess } from "../../../utils/ChalkCustomStyles";
dotEnv.config();

const YOUR_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const verify2faOtp = async (req: Request, res: Response) => {
  try {
    const { email, enteredOtp } = req.body as {
      email: string;
      enteredOtp: string;
    };
    if (!email || !enteredOtp) {
      return res.status(400).json({
        error: "payload missing",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is2faEnabled === false) {
      return res.status(400).json({ error: "2fa is not enabled" });
    }

    const otpData = await twoFA.findOne({ email }).exec();
    if (!otpData) {
      return res.status(400).json({ error: "no otp has been generated" });
    } else {
      const enteredOTP = enteredOtp.trim();
      const storedOTP = otpData.otp?.trim();
      if (enteredOTP !== storedOTP) {
        return res.status(401).json({ error: "wrong otp" });
      } else {
        otpData.otp = undefined;
        await otpData.save();
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          YOUR_SECRET_KEY!,
          { expiresIn: "720h" }
        );
        res.status(200).json({ message: "Login successful", token });
        CSuccess("login successful");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};
