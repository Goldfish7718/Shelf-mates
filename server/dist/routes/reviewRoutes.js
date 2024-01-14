"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewControllers_1 = require("../controllers/reviewControllers");
const router = (0, express_1.Router)();
router.post('/post/:userId/:productId', reviewControllers_1.addReview);
router.get('/:productId', reviewControllers_1.getReviews);
router.delete('/delete/:reviewId', reviewControllers_1.deleteReview);
exports.default = router;
