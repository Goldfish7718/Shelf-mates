import { Router } from "express";
import { addReview } from "../controllers/reviewControllers";

const router = Router()

router.post('/post/:userId/:productId', addReview)

export default router