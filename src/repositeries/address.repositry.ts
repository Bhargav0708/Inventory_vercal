import { customError } from "../helpers/customError";
import { Addresses } from "../models/address.model";
export const AddressRepositry = {
  async create(data: Addresses) {
    console.log("the data of users 'address", data);
    return await Addresses.create(data);
  },
  async getAll() {
    return await Addresses.findAll();
  },
  async update(data: Addresses, id: number) {
    try {
      const addressid = id;
      const update_address = await Addresses.update(data, {
        where: { userid: addressid },
      });

      return update_address;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(dataid: number) {
    try {
      const found_useraddres = await Addresses.findOne({
        where: { userid: dataid },
      });
      console.log("found useradrress in the repositry", found_useraddres);
      if (!found_useraddres) {
        throw new customError("USER_NOT_FOUND", "User Not Found to delete ");
      } else {
        const deletetheaddress = Addresses.destroy({
          where: { userid: dataid },
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
