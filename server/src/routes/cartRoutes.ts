import { Router } from "express";
import { addToCart, decrementQuantity, deleteProduct, getCart } from "../controllers/cartControllers";
import validateCart from "../middleware/validateCart";
import verifyToken from "../middleware/verifyToken";

const router = Router()

router.get('/getCart/:userId', verifyToken, getCart)

router.post('/add/:userId/:productId', verifyToken, validateCart, addToCart)
router.post('/decrement/:userId/:productId', verifyToken, validateCart, decrementQuantity)
router.post('/delete/:userId/:productId', verifyToken, validateCart, deleteProduct)

export default router