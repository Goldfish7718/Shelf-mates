import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/addressControllers";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, addAddress);
router.get("/", verifyToken, getAddresses);
router.put("/", verifyToken, updateAddress);
router.delete("/:addressId", verifyToken, deleteAddress);

export default router;
