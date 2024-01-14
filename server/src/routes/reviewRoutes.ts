import { Router } from "express";
import { addReview, deleteReview, getReviews } from "../controllers/reviewControllers";

const router = Router()

router.post('/post/:userId/:productId', addReview)
router.get('/:productId', getReviews)

router.delete('/delete/:reviewId', deleteReview)

export default router