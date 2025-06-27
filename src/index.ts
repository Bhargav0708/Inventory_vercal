import express from "express";

import { sequelize } from "./config/database";
import router from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import supplier from "./routes/suppiler.routes";
import product from "./routes/product.routes";
import warehouse from "./routes/warehouse.routes";
import warehouseaddress from "./routes/warehouseaddress.routes";
import address from "./routes/address.routes";
import stock from "./routes/stock.routes";
import payments from "./routes/payment.routes";
import purchase_order from "./routes/purchase_order.routes";
import sales_order from "./routes/sales_orders.routes";
import pdfroute from "./routes/pdf.routes";
import { sendSalesrecord } from "../utils/cron";
import { swaggerSpec, swaggerUi } from "./swagger";

// import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", router);
app.use("/supplier", supplier);
app.use("/product", product);
app.use("/warehouse", warehouse);
app.use("/warehouseadd", warehouseaddress);
app.use("/address", address);
app.use("/stocks", stock);
app.use("/payments", payments);
app.use("/purchaseorder", purchase_order);
app.use("/salesorder", sales_order);
app.use("/pdfroute", pdfroute);

sendSalesrecord();
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected");

    // app.listen(PORT, () => {
    //   console.log(`🚀 Server running on http://localhost:${PORT}`);
    // });
  } catch (err) {
    console.error("❌ Failed to start app:", err);
  }
};

start();
export default app;
