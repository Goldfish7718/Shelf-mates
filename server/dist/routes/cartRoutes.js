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
router.get('/getCart/:userId', verifyToken_1.default, cartControllers_1.getCart);
router.post('/add/:userId/:productId', verifyToken_1.default, validateCart_1.default, cartControllers_1.addToCart);
router.post('/decrement/:userId/:productId', verifyToken_1.default, validateCart_1.default, cartControllers_1.decrementQuantity);
router.post('/delete/:userId/:productId', verifyToken_1.default, validateCart_1.default, cartControllers_1.deleteProduct);
exports.default = router;
