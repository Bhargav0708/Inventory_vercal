import { customError } from "../helpers/customError";
import { Salesorders } from "../models/sales_order.model";

export const Sales_orderRepositry = {
  async create(data: Salesorders) {
    console.log("this is the data of purchase_orders :  ", data);
    return await Salesorders.create(data);
  },
  async getAll() {
    return await Salesorders.findAll();
  },
  async update(data: Salesorders, purchase_order_id: number) {
    console.log("the product data", data);
    const updateeduser = await Salesorders.update(data, {
      where: { purchase_order_id: purchase_order_id },
    });
    console.log("the result of update user", updateeduser);
    return updateeduser;
  },
  async delete(id: number) {
    try {
      const found_deleted_purchase = await Salesorders.findOne({
        where: { purchase_order_id: id },
      });
      console.log(
        "purchase Order_is not found in the repositry",
        found_deleted_purchase
      );
      if (!found_deleted_purchase) {
        throw new customError("USER_NOT_FOUND", "User Not Found to delete ");
      } else {
        const deletetheaddress = Salesorders.destroy({
          where: { purchase_order_id: id },
        });
        return deletetheaddress;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
};
