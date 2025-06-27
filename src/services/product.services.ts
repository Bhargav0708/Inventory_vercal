import { Product } from "../models/product.model";
import { productRespositry } from "../repositeries/product.repositry";

// id=2
export const productService = {
  async create(data: Product) {
    // const name_of_the_product = "Iphone";
    // const barcode = "012345678905";
    // const description  = "new version"
    try {
      const name = data.name;
      const barcode = data.barcode;
      const ddescription = data.description;
      const price = data.price;
      const suppiler_id = data.supplierid;
      const cateogry_id = data.categoryid;
      const productData: object = {
        name: name,
        barcode: barcode,
        description: ddescription,
        price: price,
        supplierid: suppiler_id,
        categoryid: cateogry_id,
      };
      const datatobesent = await productRespositry.create(
        productData as Product
      );
      return datatobesent;
    } catch (error) {
      console.log(error);
    }
  },
  async getAll() {
    const allusers = await productRespositry.getAll();
    return allusers;
  },
  async update(data: Product, path: string, id: number) {
    console.log("Hello i m in product update service ");
    // console.log(req.file);
    const userdata: object = {
      name: data?.name,
      barcode: data?.barcode,
      description: data?.description,
      price: data?.price,
      supplierid: data?.supplierid,
      categoryid: data?.categoryid,
      image_url: path,
    };
    const updateeduser = await productRespositry.update(
      userdata as Product,
      id
    );
    return updateeduser;
  },
  async delete(id: number) {
    const deleteeduser = await productRespositry.delete(id);
    return deleteeduser;
  },
  // async fetchAllProducts(id: number) {

  // },
};
