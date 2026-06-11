"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartControllers_1 = require("../controllers/cartControllers");
const validateCart_1 = __importDefault(require("../middleware/validateCart"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, cartControllers_1.getCart);
router.patch("/increment/:productId", verifyToken_1.default, validateCart_1.default, cartControllers_1.incrementQuantity);
router.patch("/decrement/:productId", verifyToken_1.default, validateCart_1.default, cartControllers_1.decrementQuantity);
router.delete("/:productId", verifyToken_1.default, validateCart_1.default, cartControllers_1.deleteProduct);
exports.default = router;
