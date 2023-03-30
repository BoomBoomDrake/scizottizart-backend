import express from "express";
import multer from "multer"
import StoreItemController from "./storeItem.controller.js";
import CheckoutController from "./checkout.controller.js";

const router = express.Router();
const upload = multer({limits: {fileSize: 0.5 * 1024 * 1024}});

router.route("/").get(upload.none(), StoreItemController.apiGetItems);

router.route("/category/:category").get(StoreItemController.apiGetItemsByCategory);

router.route("/dashboard/add-store-item").post(upload.any(), StoreItemController.apiAddItem)
    
router.route("/dashboard/update/:id").post(upload.any(), StoreItemController.apiUpdateItem);

router.route("/dashboard/delete/:id").post(upload.none(), StoreItemController.apiDeleteItem);   
    
router.route("/create-checkout-session").post(CheckoutController.apiCreateCheckoutSession)

export default router;