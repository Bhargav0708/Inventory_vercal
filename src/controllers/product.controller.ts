import { Request, Response } from "express";
import { productService } from "../services/product.services";
import { customError } from "../helpers/customError";

export const productController = {
  async create(req: Request, res: Response): Promise<void> {
    const product = await productService.create(req.body);
    res.status(201).json({ data: product, msg: "Product has been created" });
  },
  async getAll(req: Request, res: Response) {
    const allusers = await productService.getAll();
    res.status(200).json({ data: allusers });
  },
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      console.log("this is req.file", req.file);
      // console.log("the file is", req.file!.path);
      if (req.file === undefined || req.file.path === undefined) {
        throw new customError(
          "FILE_REQUIRED",
          "Please Enter the Product Image "
        );
      }
      // console.log(path)
      const path = req.file!.path;

      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }

      const updateduser = await productService.update(req.body, path, id);
      if (updateduser!.length > 0) {
        res.status(200).json({
          data: updateduser,
          msg: " product updated succesfully",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "Product not updated",
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
        if (error.errorKey == "FILE_REQUIRED") {
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
      const deleteeduser = await productService.delete(id);
      if (deleteeduser > 0) {
        res.status(200).json({
          data: deleteeduser,
          msg: "The Proudct is succesfully deleted ",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "The Product is not deleted ",
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
  async FetchAllProductByid(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number");
      }
      // const allproductByid =await
    } catch (error) {
      console.log(error);
    }
  },
};
