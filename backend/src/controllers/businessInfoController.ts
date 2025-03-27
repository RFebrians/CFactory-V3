import { Request, Response, RequestHandler } from "express";
import BusinessInfoModel from "../models/businessInfoModel";
import userModel from "../models/userModel";

// Fetch Business Information
/**
 * @swagger
 * /api/business-info:
 *   get:
 *     summary: Fetch business information
 *     tags:
 *       - Business Info
 *     responses:
 *       200:
 *         description: Business information retrieved successfully
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
 *                     name:
 *                       type: string
 *                     tagline:
 *                       type: string
 *                     description:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *       404:
 *         description: No business information found
 *       500:
 *         description: Server error while fetching business info
 */
const getBusinessInfo: RequestHandler = async (_req, res) => {
  try {
    let businessInfo = await BusinessInfoModel.findOne();

    if (!businessInfo) {
      // If no document exists, create a default one
      businessInfo = new BusinessInfoModel({
        name: "",
        tagline: "",
        description: "",
        phone: "",
        email: "",
        address: "",
      });
      await businessInfo.save();
    }

    res.json({ success: true, data: businessInfo });
  } catch (error) {
    console.error("Error fetching business info:", error);
    res.status(500).json({ success: false, message: "Error fetching business info" });
  }
};

// Update Business Information
/**
 * @swagger
 * /api/business-info:
 *   put:
 *     summary: Update business information
 *     tags:
 *       - Business Info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the update
 *     responses:
 *       200:
 *         description: Business information updated successfully
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
 *         description: Unauthorized, only admin can update business information
 *       500:
 *         description: Server error while updating business info
 */
const updateBusinessInfo: RequestHandler = async (req, res): Promise<void> => {
    try {
      const {name, tagline, description, phone, email, address, userId } = req.body;
      const userData = await userModel.findById(userId);
  
      if (!userData || userData.role !== "admin") {
        res.status(403).json({ success: false, message: "You are not admin" });
        return; // Ensure function exits after sending response
      }
  
      const businessInfo = await BusinessInfoModel.findOne();
      if (businessInfo) {
        businessInfo.name = name;
        businessInfo.tagline = tagline;
        businessInfo.description = description;
        businessInfo.phone = phone;
        businessInfo.email = email;
        businessInfo.address = address;
        await businessInfo.save();
      } else {
        await BusinessInfoModel.create({ tagline, description, phone, email, address });
      }
  
      res.json({ success: true, message: "Business information updated successfully" });
      return; // Explicit return for TypeScript compliance
    } catch (error) {
      console.error("Error updating business info:", error);
      res.status(500).json({ success: false, message: "Error updating business info" });
    }
  };

export { getBusinessInfo, updateBusinessInfo };
