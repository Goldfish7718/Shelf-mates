"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddresses = exports.addAddress = void 0;
const addressModel_1 = __importDefault(require("../models/addressModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { addressLine1, landmark, city, state, type, } = req.body;
        const potentialUser = await userModel_1.default.findById(userId);
        const emptyCondtion = !addressLine1 || !city || !state;
        if (!potentialUser) {
            return res
                .status(400)
                .json({ message: "User not found" });
        }
        if (emptyCondtion) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" });
        }
        const address = new addressModel_1.default({
            addressLine1,
            landmark,
            city,
            state,
            userId,
            type
        });
        address.save();
        res
            .status(200)
            .json({ message: "Address added succesfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.addAddress = addAddress;
const getAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        const potentialUser = await userModel_1.default.findById(userId);
        if (!potentialUser) {
            return res
                .status(400)
                .json({ message: "User not found" });
        }
        const addresses = await addressModel_1.default.find({ userId });
        res
            .status(200)
            .json({ addresses });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.getAddresses = getAddresses;
