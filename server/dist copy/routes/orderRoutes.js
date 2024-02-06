"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.post('/checkout/:userId', verifyToken_1.default, orderController_1.cartCheckout);
router.post('/confirmorder/:encode', verifyToken_1.default, orderController_1.confirmOrder);
exports.default = router;
