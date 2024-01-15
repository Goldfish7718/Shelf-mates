"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewControllers_1 = require("../controllers/reviewControllers");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.post('/post/:userId/:productId', verifyToken_1.default, reviewControllers_1.addReview);
router.get('/:productId', verifyToken_1.default, reviewControllers_1.getReviews);
router.delete('/delete/:reviewId', verifyToken_1.default, reviewControllers_1.deleteReview);
exports.default = router;
