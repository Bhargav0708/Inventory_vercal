import { Category } from "../models/category.model";

export const cateogryRespositry = {
  async create(data: Category) {
    console.log("the data is about cateogry", data);
    return await Category.create(data);
  },
  async getAll() {
    return await Category.findAll();
  },
  async update(data: Category, id: number) {
    try {
      const productid = id;
      const updateeduser = await Category.update(data, {
        where: { cateogry_id: productid },
      });
      return updateeduser;
    } catch (error) {
      console.log(error);
    }
  },
  async delete(id: number) {
    const deleteeduser = await Category.destroy({ where: { cateogry_id: id } });
    return deleteeduser;
    // return deleteeduser;
  },
};
