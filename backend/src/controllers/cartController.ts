import { Request, Response } from "express";
import userModel from "../models/userModel";

// Add items to cart
/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - itemId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding an item to the cart
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to be added
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while adding to cart
 */
const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData = user.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Remove items from cart
/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove an item from the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - itemId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user removing an item from the cart
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to be removed
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while removing from cart
 */
const removeFromCart = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData = user.cartData || {};
    if (cartData[req.body.itemId] > 1) {
      cartData[req.body.itemId] -= 1;
    } else {
      delete cartData[req.body.itemId];
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch cart data
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Fetch the user's cart data
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose cart data is being retrieved
 *     responses:
 *       200:
 *         description: Successfully fetched cart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cartData:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       500:
 *         description: Server error while fetching cart data
 */
const getCart = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.body.userId);
    res.json({ success: true, cartData: user?.cartData || {} });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
