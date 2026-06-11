import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getAllProducts,
} from "../controllers/productControllers";
import multer from "multer";
import verifyToken from "../middleware/verifyToken";
import verifyAdmin from "../middleware/verifyAdmin";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", verifyAdmin, upload.single("image"), addProduct);

router.get("/all", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProduct);
router.get("/category/:category", verifyToken, getProducts);

router.delete("/:productId", verifyAdmin, deleteProduct);

export default router;
