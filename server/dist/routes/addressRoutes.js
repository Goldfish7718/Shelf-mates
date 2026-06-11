"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressControllers_1 = require("../controllers/addressControllers");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, addressControllers_1.addAddress);
router.get("/", verifyToken_1.default, addressControllers_1.getAddresses);
router.put("/", verifyToken_1.default, addressControllers_1.updateAddress);
router.delete("/:addressId", verifyToken_1.default, addressControllers_1.deleteAddress);
exports.default = router;
