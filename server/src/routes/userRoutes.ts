import { Response, Router } from "express";
import { login, logout, signup } from "../controllers/userControllers";
import verifyToken, { ExtendedRequest } from "../middleware/verifyToken";

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.get('/verify', verifyToken, (req: ExtendedRequest, res: Response) => {
    const { decode } = req
    return res
        .status(200)
        .json({ isAuthenticated: true, decode, message: "Is Authenticated" })
})

export default router