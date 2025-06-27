import { Router } from "express";
import PDFDocument from "pdfkit";
import { pdfController } from "../controllers/pdf.controller";

const pdfroute = Router();

pdfroute.get("/sales-orders", pdfController.sales);
export default pdfroute;
