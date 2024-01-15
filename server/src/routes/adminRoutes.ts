import { Router } from "express";
import { getMostSoldData, getOrder, getOrders, getReviewCount, getSalesData, getUsers } from "../controllers/adminControllers";
import verifyAdmin from "../middleware/verifyAdmin";

const router = Router()

router.get('/data/mostsold', verifyAdmin, getMostSoldData)
router.get('/data/reviewcount/:productId', verifyAdmin, getReviewCount)
router.get('/data/salesdata/:productId', verifyAdmin, getSalesData)
router.get('/data/orders', verifyAdmin, getOrders)
router.get('/data/order/:orderId', verifyAdmin, getOrder)
router.get('/data/users', verifyAdmin, getUsers)

export default router