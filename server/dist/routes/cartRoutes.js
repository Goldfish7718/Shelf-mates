"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartControllers_1 = require("../controllers/cartControllers");
const validateCart_1 = __importDefault(require("../middleware/validateCart"));
const router = (0, express_1.Router)();
router.get('/getCart/:userId', cartControllers_1.getCart);
router.post('/add/:userId/:productId', validateCart_1.default, cartControllers_1.addToCart);
router.post('/decrement/:userId/:productId', validateCart_1.default, cartControllers_1.decrementQuantity);
router.post('/delete/:userId/:productId', validateCart_1.default, cartControllers_1.deleteProduct);
exports.default = router;
