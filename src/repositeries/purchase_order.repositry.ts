import { Cast } from "sequelize/types/utils";
import { paginationData } from "../controllers/purchase_order.controller";
import { customError } from "../helpers/customError";
import { Purchaseorders } from "../models/purchase_order.model";
import { Stocks } from "../models/stock.model";
import { col, Op, Sequelize, WhereOptions } from "sequelize";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { Addresses } from "../models/address.model";

export const Purchase_orderRepositry = {
  async create(data: Purchaseorders) {
    // const purchasedata_productid = data.product_id;
    // const stockquantity = Stocks.sequelize?.query(
    //   `select quantity from Stocks where product_id =${purchasedata_productid}`
    // );
    // const quantity_to_be_purchased = data.quantity;
    const quantity_of_stocks = console.log(
      "this is the data of purchase_orders :  ",
      data
    );
    return await Purchaseorders.create(data);
  },
  async getAll(data: paginationData) {
    try {
      const sortBy = data.sortBy;

      const searcheddterm = `%${data.search}%`;
      // Cast(col("order_status"), "TEXT");

      // const searcheddterm2 = `${data.search}`;
      // const wherecondition = Sequelize.where(
      //   Sequelize.cast(Sequelize.col("order_status"), "TEXT"),
      //   {
      //     [Op.like]: searcheddterm,
      //   }
      // );
      return await Purchaseorders.findAll({
        where: {
          [Op.or]: [
            {
              notes: {
                [Op.like]: searcheddterm,
              },
            },

            Sequelize.where(
              Sequelize.cast(Sequelize.col("order_status"), "TEXT"),
              {
                [Op.like]: searcheddterm,
              }
            ),
          ],
        },

        include: [
          {
            model: Product,
            as: "product",

            attributes: ["name", "barcode", "description", "price"],
            include: [
              {
                model: User,
                as: "user",
                // required: true,
                // duplicating: false,
                attributes: ["id", "name", "email", "addressid"],
                include: [
                  {
                    model: Addresses,
                    as: "addresses",
                    required: false,
                    // subQuery: false,
                    // duplicating: false,
                  },
                ],
              },
              {
                model: Category,
                as: "category",
                // required: true,
                // duplicating: false,
                attributes: ["name", "description"],
              },
            ],
          },
        ],
        limit: data.limit,
        offset: data.offset,
        order: [[sortBy, data.sortType]],
      });
    } catch (error) {
      console.log(error);
    }
  },
  async update(data: Purchaseorders, purchase_order_id: number) {
    // const productid = id;

    console.log("the product data", data);
    const updateeduser = await Purchaseorders.update(data, {
      where: { purchase_order_id: purchase_order_id },
    });
    console.log("the result of update user", updateeduser);
    return updateeduser;
  },
  async delete(id: number) {
    try {
      const found_deleted_purchase = await Purchaseorders.findOne({
        where: { purchase_order_id: id },
      });
      console.log(
        "purchase Order_is not found in the repositry",
        found_deleted_purchase
      );
      if (!found_deleted_purchase) {
        throw new customError("USER_NOT_FOUND", "User Not Found to delete ");
      } else {
        const deletetheaddress = Purchaseorders.destroy({
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
  async PurchaseOrderByuserid(id: number) {
    const finduser = await Purchaseorders.findAll({
      where: {
        user_id: id,
      },
    });
    return finduser;
  },
};
