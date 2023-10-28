import { Router } from "express";
import { cartCheckout } from "../controllers/orderController";

const router = Router()

router.post('/checkout/:userId', cartCheckout)

export default router