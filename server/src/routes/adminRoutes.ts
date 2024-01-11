import { Router } from "express";
import { getMostSoldData, getReviewCount } from "../controllers/adminControllers";

const router = Router()

router.get('/data/mostsold', getMostSoldData)
router.get('/data/reviewcount/:productId', getReviewCount)

export default router