import { customError } from "../helpers/customError";
import { Product } from "../models/product.model";
import { Stocks } from "../models/stock.model";
import { User } from "../models/user.model";

export const stockRepositry = {
  async create(data: Stocks) {
    console.log("the data of the stocks ", data);
    return await Stocks.create(data);
  },
  async getAll() {
    return await Stocks.findAll();
  },
  async update(data: Stocks, id: number) {
    try {
      const proudctid = id;
      console.log("the data and id is", data, id);
      const updatestockdata = await Stocks.update(data, {
        where: { productid: id },
      });
      return updatestockdata;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(dataid: number) {
    //
    const foundproductstocks = Stocks.findOne({
      where: { productid: dataid },
    });
    if (!foundproductstocks) {
      throw new Error("the stock is not found for the pruduct ");
    } else {
      const deletetheaddress = Stocks.destroy({ where: { productid: dataid } });
      return deletetheaddress;
    }
  },
  async getProductData(product_id: number) {
    try {
      return await Stocks.findOne({
        where: {
          productid: product_id,
          deletedAt: null,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getSupplierid(id: number) {
    try {
      const supplier = await Product.findOne({
        where: {
          product_id: id,
          deletedAt: null,
        },
      });
      console.log("the supplier data in stock repositry", supplier);
      if (supplier) {
        return supplier;
      } else {
        throw new customError(
          "PRODUCT_SUPPLER_DELETED",
          "Supplier might be get deleted "
        );
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
  async getUserAllDataByid(id: number) {
    try {
      const user = await User.findOne({
        where: {
          id: id,
          deletedAt: null,
        },
      });
      if (user) {
        return user;
      } else {
        throw new customError("USER_DELETED", "User is deleted ");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
};
