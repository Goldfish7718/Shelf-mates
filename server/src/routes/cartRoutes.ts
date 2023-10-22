import { Router } from "express";
import { addToCart, decrementQuantity, deleteProduct, getCart } from "../controllers/cartControllers";
import validateCart from "../middleware/validateCart";

const router = Router()

router.get('/getCart/:userId', getCart)

router.post('/add/:userId/:productId', validateCart, addToCart)
router.post('/decrement/:userId/:productId', validateCart, decrementQuantity)
router.post('/delete/:userId/:productId', validateCart, deleteProduct)

export default router