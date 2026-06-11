import { Router } from "express";
import {
  incrementQuantity,
  decrementQuantity,
  deleteProduct,
  getCart,
} from "../controllers/cartControllers";
import validateCart from "../middleware/validateCart";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.get("/", verifyToken, getCart);

router.patch("/increment/:productId", verifyToken, validateCart, incrementQuantity);
router.patch("/decrement/:productId", verifyToken, validateCart, decrementQuantity);
router.delete("/:productId", verifyToken, validateCart, deleteProduct);

export default router;
