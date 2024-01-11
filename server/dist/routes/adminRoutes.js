"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminControllers_1 = require("../controllers/adminControllers");
const router = (0, express_1.Router)();
router.get('/data/mostsold', adminControllers_1.getMostSoldData);
router.get('/data/reviewcount/:productId', adminControllers_1.getReviewCount);
exports.default = router;
