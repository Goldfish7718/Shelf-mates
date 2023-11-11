import { Router } from "express";
import { cartCheckout, confirmOrder } from "../controllers/orderController";

const router = Router()

router.post('/checkout/:userId', cartCheckout)
router.post('/confirmorder/:encode', confirmOrder)

export default router