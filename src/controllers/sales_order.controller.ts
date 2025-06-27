import { Request, Response } from "express";
import { Purchase_orderServices } from "../services/purchase_order.services";
import { productService } from "../services/product.services";
import { Sales_orderServices } from "../services/sales_order.services";
import { customError } from "../helpers/customError";

export const sales_orderController = {
  async create(req: Request, res: Response) {
    // const data = req.user?.id;
    try {
      const product_id = Number(req.params.id);
      if (isNaN(product_id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      // console.log("the id is ", data);
      console.log("the user id logged in ", product_id);
      const purchase_orderdata = await Sales_orderServices.create(
        req.body,
        product_id
      );
      res.status(201).json({
        data: purchase_orderdata,
        msg: "the sales order is created",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey == "ID_NAN") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async getAll() {},
  async update() {},
  async delete() {},
};
