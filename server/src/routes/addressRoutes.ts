import { Router } from "express";
import { addAddress, getAddresses, updateAddress } from "../controllers/addressControllers";

const router = Router();

router.post('/addaddress/:userId', addAddress);
router.get('/getaddresses/:userId', getAddresses)
router.put('/updateaddress', updateAddress)

export default router;