import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const frontend_url = process.env.FRONTEND_URL || "";

// Placing an order
/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place an order and create a Stripe checkout session
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - amount
 *               - address
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user placing the order
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: integer
 *                 description: List of items in the order
 *               amount:
 *                 type: number
 *                 description: Total order amount in USD
 *               address:
 *                 type: string
 *                 description: Delivery address
 *     responses:
 *       200:
 *         description: Order placed successfully and Stripe session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 session_url:
 *                   type: string
 *       500:
 *         description: Server error while placing the order
 */
const placeOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Verifying an order
/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     summary: Verify order payment status
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - success
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order being verified
 *               success:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 description: Payment success or failure
 *     responses:
 *       200:
 *         description: Order verified successfully
 *       500:
 *         description: Server error while verifying order
 */
const verifyOrder = async (req: Request, res: Response) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetching user orders
/**
 * @swagger
 * /api/order/user:
 *   get:
 *     summary: Get a user's orders
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose orders are fetched
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             price:
 *                               type: number
 *                             quantity:
 *                               type: integer
 *                       amount:
 *                         type: number
 *                       address:
 *                         type: string
 *                       payment:
 *                         type: boolean
 *       500:
 *         description: Server error while fetching orders
 */
const userOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin - Listing all orders
/**
 * @swagger
 * /api/order/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID for authentication
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             price:
 *                               type: number
 *                             quantity:
 *                               type: integer
 *                       amount:
 *                         type: number
 *                       address:
 *                         type: string
 *                       payment:
 *                         type: boolean
 *       403:
 *         description: User is not an admin
 *       500:
 *         description: Server error while fetching orders
 */
const listOrders = async (req: Request, res: Response) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin - Updating order status
/**
 * @swagger
 * /api/order/update:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *               - userId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order being updated
 *               status:
 *                 type: string
 *                 description: New order status (e.g., "Shipped", "Delivered")
 *               userId:
 *                 type: string
 *                 description: Admin user ID for authentication
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       403:
 *         description: User is not an admin
 *       500:
 *         description: Server error while updating order status
 */
const updateStatus = async (req: Request, res: Response) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
