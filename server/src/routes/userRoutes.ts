import { Response, Router } from "express";
import { changePassword, deleteUser, login, logout, signup, updateUser } from "../controllers/userControllers";
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

router.put('/update/:userId', updateUser)
router.patch('/updatepassword/:userId', changePassword)
router.delete('/delete/:userId', deleteUser)

export default router