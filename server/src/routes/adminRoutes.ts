import { Router } from "express";
import { getMostSoldData, getOrders, getReviewCount, getSalesData } from "../controllers/adminControllers";

const router = Router()

router.get('/data/mostsold', getMostSoldData)
router.get('/data/reviewcount/:productId', getReviewCount)
router.get('/data/salesdata/:productId', getSalesData)
router.get('/data/orders', getOrders)

export default router