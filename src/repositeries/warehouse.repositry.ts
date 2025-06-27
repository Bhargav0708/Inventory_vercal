import { Warehouse } from "../models/warehouse.model";

export const warehouseRespositry = {
  async create(data: Warehouse) {
    console.log(
      "this is the data of warehouse which is to be registed soon",
      data
    );
    return await Warehouse.create(data);
  },
  async getAll() {
    return await Warehouse.findAll();
  },
  async update(data: Warehouse, id: number) {
    try {
      const updatedwarehouse = await Warehouse.update(data, {
        where: { warehouse_id: id },
      });
      return updatedwarehouse;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(dataid: number) {
    const foundwarehouse = Warehouse.findOne({
      where: { warehouse_id: dataid },
    });
    if (!foundwarehouse) {
      throw new Error("the warehouse is not found");
    } else {
      const deletewarehouse = Warehouse.destroy({
        where: { warehouse_id: dataid },
      });
      return deletewarehouse;
    }
  },
};
