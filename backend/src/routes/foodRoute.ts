import express from "express";
import { addFood, listFood, removeFood,getFoodDetail } from "../controllers/foodController";
import multer from "multer";
import authMiddleware from "../middleware/auth";

const foodRouter = express.Router();

// Image Storage Engine

const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})

foodRouter.post("/add",upload.single("image"),authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);
foodRouter.get("/:id",getFoodDetail);


export default foodRouter;
