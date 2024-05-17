import { User } from "../../models/LocalAuth/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { CError, CSuccess } from "../../utils/ChalkCustomStyles";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
dotEnv.config();

import rateLimit from "express-rate-limit";
import { isEmail } from "../../utils/isEmail";
import { sendEmail } from "../../utils/EmailService";
import { twoFA } from "../../models/LocalAuth/2faotp/otp";

const YOUR_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

const emailLimiter = rateLimit({
  windowMs: 15 * 1000, //15s
  max: 5, // limit each IP to 5 requests per windowMs
  keyGenerator: (req: Request) => req.body.email,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

export const login = async (req: Request, res: Response) => {
  emailLimiter(req, res, async () => {
    isEmail(req, res, async () => {
      let { email, password } = req.body as {
        email: string;
        password: string;
      };

      email = email.toString().trim();
      password = password.toString().trim();

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please fill all required fields" });
      }

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "No account found" });
        }
        if (user.is2faEnabled === false) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
          }

          const token = jwt.sign(
            { userId: user._id, email: user.email },
            YOUR_SECRET_KEY!,
            { expiresIn: "720h" }
          );

          res.status(200).json({ message: "Login successful", token });
          CSuccess("login successful");
        } else if (user.is2faEnabled === true) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
          } else {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const OTP = otp.toString().trim();

            sendEmail(
              user.email,
              `[OTP] Two Factor Authentication OTP `,
              `Your 2FA OTP is ${OTP} \n\n Do not Share with anyone.`
            );

            const preExistingOtp = await twoFA.findOne({ email }).exec();
            if (preExistingOtp) {
              await twoFA.findOneAndUpdate({ email }, { otp: OTP });
            } else {
              const otpData = new twoFA({
                email: user.email,
                otp: OTP,
              });
              await otpData.save();
            }

            res.status(200).json({
              message: "Proceed to verify otp page",
              userEmail: user.email,
            });
          }
        } else {
          return res
            .status(400)
            .json({ error: "Something went wrong during login operation" });
        }
      } catch (error) {
        CError("Failed to log in");
        res.status(500).json({ error: "Failed to log in" });
        console.error(error);
      }
    });
  });
};
