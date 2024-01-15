import { Router } from "express";
import { getMostSoldData, getOrder, getOrders, getReviewCount, getSalesData, getUsers } from "../controllers/adminControllers";

const router = Router()

router.get('/data/mostsold', getMostSoldData)
router.get('/data/reviewcount/:productId', getReviewCount)
router.get('/data/salesdata/:productId', getSalesData)
router.get('/data/orders', getOrders)
router.get('/data/order/:orderId', getOrder)
router.get('/data/users', getUsers)

export default router