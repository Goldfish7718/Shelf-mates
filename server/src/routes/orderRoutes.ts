import { Router } from "express";
import { cartCheckout, confirmOrder } from "../controllers/orderController";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post("/checkout", verifyToken, cartCheckout);
router.post("/confirmorder/:orderId", verifyToken, confirmOrder);

export default router;
