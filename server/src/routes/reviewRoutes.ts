import { Router } from "express";
import { addReview, deleteReview } from "../controllers/reviewControllers";

const router = Router()

router.post('/post/:userId/:productId', addReview)
router.delete('/delete/:reviewId', deleteReview)

export default router