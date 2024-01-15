import { Router } from "express";
import { addReview, deleteReview, getReviews } from "../controllers/reviewControllers";
import verifyToken from "../middleware/verifyToken";

const router = Router()

router.post('/post/:userId/:productId', verifyToken, addReview)
router.get('/:productId', verifyToken, getReviews)

router.delete('/delete/:reviewId', verifyToken, deleteReview)

export default router