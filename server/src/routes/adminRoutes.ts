import { Router } from "express";
import { getMostSoldData, getOrder, getOrders, getReviewCount, getSalesData } from "../controllers/adminControllers";

const router = Router()

router.get('/data/mostsold', getMostSoldData)
router.get('/data/reviewcount/:productId', getReviewCount)
router.get('/data/salesdata/:productId', getSalesData)
router.get('/data/orders', getOrders)
router.get('/data/order/:orderId', getOrder)

export default router