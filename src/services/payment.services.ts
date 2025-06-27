import { Payments } from "../models/payment.model";
import { paymentRepositry } from "../repositeries/payment.repositry";

export const paymentService = {
  async create(data: Payments) {
    console.log("the data of the payment in the payment services");
    const payment_personid = data.payment_personid;
    const amount = data.amount;
    const payment_method = data.payment_method;
    const payment_status = data.payment_status;
    const paymentData: object = {
      payment_personid: payment_personid,
      amount: amount,
      payment_method: payment_method,
      payment_status: payment_status,
    };
    const datatobesent = await paymentRepositry.create(paymentData as Payments);
    return datatobesent;
  },
};
