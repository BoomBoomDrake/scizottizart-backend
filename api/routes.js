import express from "express";
import multer from "multer"
import StoreItemController from "./storeItem.controller.js";
import CheckoutController from "./checkout.controller.js";

const router = express.Router();
const upload = multer({limits: {fileSize: 500000}});

router.route("/category/:category").get(StoreItemController.apiGetItemsByCategory);

router.route("/dashboard")
    .post(upload.any(), StoreItemController.apiAddItem)
    .put(upload.none(), StoreItemController.apiUpdateItem)
    .delete(upload.none(), StoreItemController.apiDeleteItem)

router.route("/create-checkout-session").post(CheckoutController.apiCreateCheckoutSession)

export default router;