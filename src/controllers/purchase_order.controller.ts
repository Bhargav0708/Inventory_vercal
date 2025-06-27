import { Request, Response } from "express";
import { Purchase_orderServices } from "../services/purchase_order.services";
import { productService } from "../services/product.services";
import { customError } from "../helpers/customError";
import { error } from "console";

export interface paginationData {
  limit: number;
  offset: number;
  sortBy: string;
  sortType: string;
  search: string;
}
export const purchase_orderController = {
  async create(req: Request, res: Response): Promise<void> {
    // const data = req.user?.id;
    try {
      const product_id = Number(req.params.id);
      if (isNaN(product_id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      // console.log("the id is ", data);
      console.log("the user id logged in ");
      const purchase_orderdata = await Purchase_orderServices.create(
        req.body,
        product_id
      );
      if (purchase_orderdata) {
        res.status(201).json({
          data: purchase_orderdata,
          msg: "the purchase order is created ",
        });
      }
      //  else {
      //   // res.json({})
      //   // throw new customError(
      //   //   "ORDER_CREATION_FAILED",
      //   //   "Failed to create purchase order"
      //   // );
      //   res.json({
      //     err: "Failed to create purchase order ",
      //   });
      // }
      // console.log("the message of purchase orderdata", purchase_orderdata);
    } catch (error) {
      // console.log(error);
      if (error instanceof customError) {
        if (error.errorKey === "Quantity_Exceed") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "ID_NAN") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "PRODUCT_SUPPLER_DELETED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "USER_DELETED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 0;

      const limit = Number(req.query.pageSize) || 20;

      const offset = limit * page;

      const sortBy = String(req.query.sortBy) || "title_amount";

      const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";

      const search = String(req.query.search) || "";
      const paginationData: paginationData = {
        limit: limit,
        offset: offset,
        sortBy: sortBy,
        sortType: sortType,
        search: search,
      };
      const allpurchase = await Purchase_orderServices.getAll(paginationData);
      console.log("this is the all purchase", allpurchase);
      // if()
      if (allpurchase) {
        res.status(200).json({ data: allpurchase });
      } else {
        throw new customError("DATA_NOT_FOUND", "The Data Not Found");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey == "DATA_NOT_FOUND") {
          res.status(204).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      // console.log(path)
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID In  Number ");
      }
      const updateduser = await Purchase_orderServices.update(req.body, id);
      if (updateduser!.length > 0) {
        res.status(200).json({
          data: updateduser,
          msg: " purchase_order updated succesfully",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "Purchase Order is not updated",
        });
      }
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
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      const deleteeduser = await Purchase_orderServices.delete(id);
      if (deleteeduser == 1) {
        res.status(200).json({
          data: deleteeduser,
          msg: "The Purchase order  is succesfully deleted ",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "The purchase Order is not deleted ",
        });
      }
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
  async PurchaseorderbyUseridget(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      const allpurchaseorderbyuser =
        await Purchase_orderServices.purchaseorderbyuserid(id);
      res.json({
        data: allpurchaseorderbyuser,
        msg: "All the Purchase Orders by the user ",
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
};
