import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import Product, { ProductDocument } from "../models/productModel"; // Assuming you've typed this model
import Cart, { CartDocument } from "../models/cartModel"; // Assuming you've typed this model

export interface ExtendedRequest extends Request {
    product?: ProductDocument & Document;
    cart?: CartDocument & Document;
}

const validateCart = async (req: ExtendedRequest, res: Response, next: Function) => {

    const { productId, userId } = req.params;
    const operation = req.body.operation || 'increment'

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(403).json({ message: "Invalid User ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID format" });
    }

    try {
        const potentialProduct = await Product.findById(productId)
        const potentialCart = await Cart.findOne({ userId })

        if (!potentialCart)
            return res
                .status(403)
                .json({ message: "This User Does Not Exist" })

        if (!potentialProduct)
            return res
                .status(400)
                .json({ message: "This Product Does not exist" })

        if (operation == 'increment' && potentialProduct.stock < 1)
            return res
                .status(400)
                .json({ message: "Cannot add more than avilable stock" })

        req.product = potentialProduct
        req.cart = potentialCart

        next()
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
        console.error(err)
    }
}

export default validateCart