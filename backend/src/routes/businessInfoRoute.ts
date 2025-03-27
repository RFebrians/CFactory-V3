import express from "express";
import { getBusinessInfo, updateBusinessInfo } from "../controllers/businessInfoController";
import authMiddleware from "../middleware/auth";

const businessInfoRouter = express.Router();

businessInfoRouter.get("/", getBusinessInfo);
businessInfoRouter.put("/", authMiddleware, updateBusinessInfo);

export default businessInfoRouter;
