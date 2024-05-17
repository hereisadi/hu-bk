import express, { Request, Response } from "express";
import home from "../controllers/Home";
import { dashboard } from "../controllers/LocalAuth/Dashboard";
import { AuthRequest } from "../utils/types/AuthRequest";
import { signup } from "../controllers/LocalAuth/Signup";
import { login } from "../controllers/LocalAuth/Login";
import { editProfile } from "../controllers/LocalAuth/EditProfile";
import { sendEmailVerificationLink } from "../controllers/LocalAuth/magiclink/verifyemail/sendEmailVerifyLink";
import { verifyEmail } from "../controllers/LocalAuth/magiclink/verifyemail/VerifyEmail";
import { sendResetPwdLink } from "../controllers/LocalAuth/magiclink/forgotpassword/sendresetpasswordlink";
import { resetPwd } from "../controllers/LocalAuth/magiclink/forgotpassword/Resetpassword";
import { toggle2fa } from "../controllers/LocalAuth/2fa/toggle2fa";
import { verify2faOtp } from "../controllers/LocalAuth/2fa/verify2faotp";
import { placeOrder } from "../controllers/Client/PlaceOrder";
import { addItem } from "../controllers/Admin/AddItem";
import { editItem } from "../controllers/Admin/EditItem";
import { deleteItem } from "../controllers/Admin/DeleteItem";
import { deleteOrder } from "../controllers/Admin/orders/DeleteOrder";
import { toggleAvailabilityForSale } from "../controllers/Admin/orders/MarkCategoryNotForSale";
import { addToCart } from "../controllers/Client/AddToCart";
import { removeFromCart } from "../controllers/Client/RemoveFromCart";
import { fetchItems } from "../controllers/Client/FetchItems";
import { addDeliveryTime } from "../controllers/Admin/orders/AddDeliveryTime";
import { markOrderAsDone } from "../controllers/Admin/orders/MarkOrderAsDone";
import { fetchOrders } from "../controllers/Admin/orders/FetchOrders";

const router = express.Router();

router.get("/", home);

router.post("/signup", signup);
router.post("/login", login);

// dashboard
const dashboardReqHandler = (req: Request, res: Response) => {
  dashboard(req as AuthRequest, res);
};
router.get("/dashboard", dashboardReqHandler);

// edit profile
const EditProfileHandler = (req: Request, res: Response) => {
  editProfile(req as AuthRequest, res);
};
router.put("/editprofile", EditProfileHandler);

// verify email
const SendEmailVerificationLinkeHandler = (req: Request, res: Response) => {
  sendEmailVerificationLink(req as AuthRequest, res);
};
router.post("/sendverificationlink", SendEmailVerificationLinkeHandler);
router.put("/verifyemail", verifyEmail);

// reset password
router.post("/sendresetpwdlink", sendResetPwdLink);
router.put("/resetpwd", resetPwd);

// toggle 2fa
const twoFaHandler = (req: Request, res: Response) => {
  toggle2fa(req as AuthRequest, res);
};
router.put("/toggle2fa", twoFaHandler);

//2fa
router.post("/verify2faotp", verify2faOtp);

// ! app specific routes

// place order
const PlaceOrderHandler = (req: Request, res: Response) => {
  placeOrder(req as AuthRequest, res);
};
router.post("/placeorder", PlaceOrderHandler);

// add item for the admin
const AddItemHandler = (req: Request, res: Response) => {
  addItem(req as AuthRequest, res);
};
router.post("/additem", AddItemHandler);

// edit item
const EditItemHandler = (req: Request, res: Response) => {
  editItem(req as AuthRequest, res);
};
router.put("/edititem", EditItemHandler);

// delete item
const DeleteItemHandler = (req: Request, res: Response) => {
  deleteItem(req as AuthRequest, res);
};
router.delete("/deleteitem", DeleteItemHandler);

// delete order for the admin
const DeleteOrderHandler = (req: Request, res: Response) => {
  deleteOrder(req as AuthRequest, res);
};
router.delete("/deleteorder", DeleteOrderHandler);

// toggle availability for sale
const ToggleAvailabilityHandler = (req: Request, res: Response) => {
  toggleAvailabilityForSale(req as AuthRequest, res);
};
router.put("/toggleavailabilityforsale", ToggleAvailabilityHandler);

// add to cart
const AddTocartHandler = (req: Request, res: Response) => {
  addToCart(req as AuthRequest, res);
};
router.post("/addtocart", AddTocartHandler);

// remove from cart
const RemoveFromCartHandler = (req: Request, res: Response) => {
  removeFromCart(req as AuthRequest, res);
};
router.post("/removefromcart", RemoveFromCartHandler);

// fetch all items
const GetItemsHandler = (req: Request, res: Response) => {
  fetchItems(req as AuthRequest, res);
};
router.get("/items", GetItemsHandler);

// add custom delivery time
const DeliveryTimeHandler = (req: Request, res: Response) => {
  addDeliveryTime(req as AuthRequest, res);
};
router.put("/adddeliverytime", DeliveryTimeHandler);

// mark order as done
const OrderAsDoneHandler = (req: Request, res: Response) => {
  markOrderAsDone(req as AuthRequest, res);
};
router.put("/markorderasdone", OrderAsDoneHandler);

// fetch all orders for the admin
const AllOrdersHandler = (req: Request, res: Response) => {
  fetchOrders(req as AuthRequest, res);
};
router.get("/orders", AllOrdersHandler);

export default router;
