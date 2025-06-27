import { Product } from "../models/product.model";
const { Op } = require("sequelize");

export const productRespositry = {
  async create(data: Product) {
    console.log("the data is about Product", data);
    return await Product.create(data);
  },
  async getAll() {
    // return await Product.findAll();
    return await Product.findAll({
      where: {
        price: {
          [Op.between]: [50000, 100000],
        },
      },
      limit: 5,
      offset: 2,
      order: [["price", "ASC"]],
    });
  },

  async update(data: Product, id: number) {
    try {
      const productid = id;

      console.log("the product data", data);
      const updateeduser = await Product.update(data, {
        where: { product_id: productid },
      });
      console.log("the result of update user", updateeduser);
      return updateeduser;
    } catch (error) {
      console.log(error);
    }

    // await Product.update();
  },
  async delete(dataid: number) {
    // const id = data.id;
    const found = Product.findOne({ where: { product_id: dataid } });
    // if (found) {
    // }
    const deletedproduct = Product.destroy({ where: { product_id: dataid } });
    return deletedproduct;
  },
  // async fetchallproductbyid(id: number) {},
  //   async update(data: Product) {},
};
