"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressControllers_1 = require("../controllers/addressControllers");
const router = (0, express_1.Router)();
router.post('/addaddress/:userId', addressControllers_1.addAddress);
router.get('/getaddresses/:userId', addressControllers_1.getAddresses);
router.put('/updateaddress', addressControllers_1.updateAddress);
exports.default = router;
