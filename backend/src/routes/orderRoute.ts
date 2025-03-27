import express from "express";
import authMiddleware from "../middleware/auth";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status",authMiddleware,updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",authMiddleware,listOrders);

export default orderRouter;