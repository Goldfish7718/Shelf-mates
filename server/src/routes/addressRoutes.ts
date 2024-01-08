import { Router } from "express";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressControllers";

const router = Router();

router.post('/addaddress/:userId', addAddress);
router.get('/getaddresses/:userId', getAddresses)
router.put('/updateaddress', updateAddress)
router.delete('/deleteaddress/:addressId', deleteAddress)

export default router;