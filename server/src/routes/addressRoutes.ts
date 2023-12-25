import { Router } from "express";
import { addAddress, getAddresses } from "../controllers/addressControllers";

const router = Router();

router.post('/addaddress/:userId', addAddress);
router.get('/getaddresses/:userId', getAddresses)

export default router;