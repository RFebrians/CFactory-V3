
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import foodRouter from "./routes/foodRoute";
import userRouter from "./routes/userRoute";
import "dotenv/config";
import cartRouter from "./routes/cartRoute";
import orderRouter from "./routes/orderRoute";
import businessInfoRouter from "./routes/businessInfoRoute";

import swaggerUi from 'swagger-ui-express';
// @ts-ignore
import specs from "../swagger";

// app config
export const app = express();
const port =process.env.PORT ?? 5000;

//middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/menu", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/business-info", businessInfoRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
