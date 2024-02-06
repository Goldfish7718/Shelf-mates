"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productControllers_1 = require("../controllers/productControllers");
const multer_1 = __importDefault(require("multer"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/upload', verifyAdmin_1.default, upload.single('image'), productControllers_1.addProduct);
router.get('/getByCat/:category', verifyToken_1.default, productControllers_1.getProducts);
router.get('/getProduct/:id', verifyToken_1.default, productControllers_1.getProduct);
router.delete('/deleteProduct/:productId', verifyAdmin_1.default, productControllers_1.deleteProduct);
exports.default = router;
