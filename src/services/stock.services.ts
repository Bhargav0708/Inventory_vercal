import { machine } from "os";
import { Stocks } from "../models/stock.model";
import { stockRepositry } from "../repositeries/stock.repositry";
import { SendAlert } from "../../utils/mailer";
import { customError } from "../helpers/customError";

export const stockService = {
  async create(data: Stocks) {
    try {
      console.log("the data of the stock in the service", data);
      const productid = data.productid;
      const warehouse_id = data.warehouse_id;
      const quantity = data.quantity;
      const minstock = data.minstock;
      const maxstock = data.maxstock;
      const recordstock = data.recordstock;
      const stock_data: object = {
        productid: productid,
        warehouse_id: warehouse_id,
        quantity: quantity,
        minstock: minstock,
        maxstock: maxstock,
        recordstock: recordstock,
      };
      const datatobesent = await stockRepositry.create(stock_data as Stocks);
      return datatobesent;
    } catch (error) {
      console.log("errro is:", error);
    }
  },
  async getAll() {
    const stocks = await stockRepositry.getAll();
    return stocks;
  },

  async update(data: Stocks, id: number) {
    // const is_available = await stockRepositry.getProductData(id);
    const updateedstock = await stockRepositry.update(data, id);
    return updateedstock;
  },
  async delete(id: number) {
    const deleteedstock = await stockRepositry.delete(id);
    return deleteedstock;
  },
  async Alert(id: number) {
    try {
      const product_id = id;
      console.log("the product_id is ", product_id);
      const product_data = await stockRepositry.getProductData(product_id);
      console.log("the product data is ", product_data);

      const supplier_data = await stockRepositry.getSupplierid(product_id);
      console.log("supplier data all data ", supplier_data);
      console.log("supplier data", supplier_data);
      const product_name = supplier_data?.name;
      console.log("the product name:", product_name);

      const supplier_id = supplier_data?.supplierid;

      // const all_data = await
      const user_all_data = await stockRepositry.getUserAllDataByid(
        supplier_id!
      );
      const user_email = user_all_data?.email;
      console.log("the user Email", user_email);
      // const user_role = user_all_data?.role;
      const subject = "⚠️!Important";
      if (product_data?.quantity! < product_data?.minstock!) {
        const message = `Alert Your Product ${product_name} has low stock fill it before out of stock genrated on ${Date.now()}`;
        console.log("the email", user_email);
        SendAlert(user_email!, subject, message);
      } else if (product_data?.quantity! > product_data?.maxstock!) {
        const message = `Alert Your Product ${product_name} has over stock so don't try to fill it genrated on ${Date.now()}`;
        console.log("the email", user_email);
        SendAlert(user_email!, subject, message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
};
