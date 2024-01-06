"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewControllers_1 = require("../controllers/reviewControllers");
const router = (0, express_1.Router)();
router.post('/post/:userId/:productId', reviewControllers_1.addReview);
exports.default = router;
