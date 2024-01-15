import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProducts } from "../controllers/productControllers";
import multer from "multer";
import verifyToken from "../middleware/verifyToken";
import verifyAdmin from "../middleware/verifyAdmin";

const router = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.post('/upload', verifyAdmin, upload.single('image'), addProduct)

router.get('/getByCat/:category', verifyToken, getProducts)
router.get('/getProduct/:id', verifyToken, getProduct)

router.delete('/deleteProduct/:productId', verifyAdmin, deleteProduct)

export default router