import { Router } from "express";
import { purchase_orderController } from "../controllers/purchase_order.controller";
import { sales_orderController } from "../controllers/sales_order.controller";

const sales_order = Router();

sales_order.post("/create/:id", sales_orderController.create);
export default sales_order;
