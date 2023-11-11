"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
router.post('/checkout/:userId', orderController_1.cartCheckout);
router.post('/confirmorder/:encode', orderController_1.confirmOrder);
exports.default = router;
