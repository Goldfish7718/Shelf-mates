import { Router } from "express";
import { cartCheckout, confirmOrder } from "../controllers/orderController";
import verifyToken from "../middleware/verifyToken";

const router = Router()

router.post('/checkout/:userId', verifyToken, cartCheckout)
router.post('/confirmorder/:encode', verifyToken, confirmOrder)

export default router