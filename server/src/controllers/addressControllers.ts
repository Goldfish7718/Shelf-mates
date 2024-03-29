import { Request, Response } from "express";
import Address, { AddressType } from "../models/addressModel";
import User from "../models/userModel";

export const addAddress = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { 
            addressLine1,
            landmark,
            city,
            state,
            type,
         }: AddressType = req.body;

        const potentialUser = await User.findById(userId);
        const emptyCondtion = !addressLine1 || !city || !state;

        const addressCount = await Address.find({ userId }).countDocuments()

        if (addressCount >= 5)
            return res
                .status(400)
                .json({ message: "Cannot add more than 5 addresses" })

        if (!potentialUser) {
        return res
            .status(400)
            .json({ message: "User not found" })
        }

        if (emptyCondtion) {
        return res
            .status(400)
            .json({ message: "Please fill all the fields" })
        }

        const address = new Address({
            addressLine1,
            landmark,
            city,
            state,
            userId,
            type
        })

        address.save()

        res
            .status(200)
            .json({ message: "Address added succesfully" })

    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const potentialUser = await User.findById(userId);

        if (!potentialUser) {
        return res
            .status(400)
            .json({ message: "User not found" })
        }
        
        const addresses = await Address.find({ userId })

        res
            .status(200)
            .json({ addresses })
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const address = req.body.address
        
        const updatedDocument = await Address.findByIdAndUpdate(
            address._id,
            { $set: address },
            { new: true }
        )

        res
            .status(200)
            .json({ message: "Address Updated Successfully" })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { addressId } = req.params;

        await Address.findByIdAndDelete(addressId)

        res
            .status(200)
            .json({ message: "Address Deleted Succesfully" })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}