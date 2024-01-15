"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminControllers_1 = require("../controllers/adminControllers");
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = (0, express_1.Router)();
router.get('/data/mostsold', verifyAdmin_1.default, adminControllers_1.getMostSoldData);
router.get('/data/reviewcount/:productId', verifyAdmin_1.default, adminControllers_1.getReviewCount);
router.get('/data/salesdata/:productId', verifyAdmin_1.default, adminControllers_1.getSalesData);
router.get('/data/orders', verifyAdmin_1.default, adminControllers_1.getOrders);
router.get('/data/order/:orderId', verifyAdmin_1.default, adminControllers_1.getOrder);
router.get('/data/users', verifyAdmin_1.default, adminControllers_1.getUsers);
exports.default = router;
