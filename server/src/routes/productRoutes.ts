import { Router } from "express";
import { addProduct, getProduct, getProducts } from "../controllers/productControllers";
import multer from "multer";
import verifyToken from "../middleware/verifyToken";

const router = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), addProduct)

router.get('/getByCat/:category', getProducts)
router.get('/getProduct/:id', verifyToken, getProduct)

export default router