import { Request, Response } from "express";
import foodModel from "../models/foodModel";
import userModel from "../models/userModel";
import fs from "fs";

// Adding menu items
/**
 * @swagger
 * /api/menu/add:
 *   post:
 *     summary: Add a new menu item
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - image
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the food item
 *               description:
 *                 type: string
 *                 description: A short description of the food item
 *               price:
 *                 type: number
 *                 description: Price of the food item
 *               category:
 *                 type: string
 *                 description: Category of the food item
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the food item
 *               userId:
 *                 type: string
 *                 description: Admin user ID for authentication
 *     responses:
 *       200:
 *         description: Food item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: User is not an admin
 *       500:
 *         description: Server error while adding food
 */
const addFood = async (req: Request, res: Response) => {
  const image_filename = req.file?.filename;

  if (!image_filename) {
    res.status(404).json({ success: false, message: "No image uploaded" });
    return;
  }

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetching all menu items
/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags:
 *       - Food
 *     responses:
 *       200:
 *         description: List of food items
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
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       image:
 *                         type: string
 *       500:
 *         description: Server error while fetching food items
 */
const listFood = async (_req: Request, res: Response) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Removing menu items
/**
 * @swagger
 * /api/menu/remove:
 *   delete:
 *     summary: Remove a menu item
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - userId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the food item to remove
 *               userId:
 *                 type: string
 *                 description: Admin user ID for authentication
 *     responses:
 *       200:
 *         description: Food item removed successfully
 *       404:
 *         description: Food item not found
 *       403:
 *         description: User is not an admin
 *       500:
 *         description: Server error while removing food
 */
const removeFood = async (req: Request, res: Response) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      if (food) {
        fs.unlink(`uploads/${food.image}`, () => {});
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
      } else {
        res.json({ success: false, message: "Food not found" });
      }
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch a single food item by ID
/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get details of a specific menu item
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the food item to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved food details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *                     image:
 *                       type: string
 *       400:
 *         description: Missing food ID in request
 *       404:
 *         description: Food item not found
 *       500:
 *         description: Server error while fetching food details
 */
const getFoodDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Food ID is required" });
      return;
    }

    const food = await foodModel.findById(id);

    if (!food) {
      res.status(404).json({ success: false, message: "Food item not found" });
      return;
    }

    res.json({ success: true, data: food });
  } catch (error) {
    console.error("Error fetching food detail:", error);
    res.status(500).json({ success: false, message: "Error fetching food details" });
  }
};

export { addFood, listFood, removeFood, getFoodDetail  };
