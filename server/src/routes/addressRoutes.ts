import { Router } from "express";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressControllers";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post('/addaddress/:userId', verifyToken, addAddress);
router.get('/getaddresses/:userId', verifyToken, getAddresses)
router.put('/updateaddress', verifyToken, updateAddress)
router.delete('/deleteaddress/:addressId', verifyToken, deleteAddress)

export default router;