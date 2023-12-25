"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    addressLine1: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        default: 'N/A'
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        default: 'Home',
        required: true
    }
});
const Address = (0, mongoose_1.model)('Address', addressSchema);
exports.default = Address;
