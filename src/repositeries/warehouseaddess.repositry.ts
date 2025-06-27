import { create } from "domain";
import { Warehouseaddresses } from "../models/warehouseaddress.model";

export const warehouseAddressesRepostiry = {
  async create(data: Warehouseaddresses) {
    console.log("this is the data of address of warehouse information", data);
    return await Warehouseaddresses.create(data);
  },
  async getAll() {
    return await Warehouseaddresses.findAll();
  },
  async update(data: Warehouseaddresses, id: number) {
    try {
      const updatedwarehouse = await Warehouseaddresses.update(data, {
        where: { warehouseid: id },
      });
      return updatedwarehouse;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(dataid: number) {
    const foundwarehouse = Warehouseaddresses.findOne({
      where: { warehouseid: dataid },
    });
    if (!foundwarehouse) {
      throw new Error("the warehouse is not found");
    } else {
      const deletewarehouse = Warehouseaddresses.destroy({
        where: { warehouseid: dataid },
      });
      return deletewarehouse;
    }
  },
};
