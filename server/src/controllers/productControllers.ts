import { Request, Response } from "express";
import Product from "../models/productModel";
import { ExtendedRequest } from "../middleware/verifyToken";
import User from "../models/userModel";

export const addProduct = async (req: Request, res: Response) => {
    try {
        if (!req.file) 
        return res
            .status(400)
            .json({ message: "All Fields are required" })

        const { name, description, price, stock, category } = req.body
        const { buffer, mimetype } = req.file;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            image: {
                data: buffer,
                contentType: mimetype
            }
        });

        await newProduct.save();

        res
            .status(200)
            .json({ message: 'Product Added Succesfully' })
        
    } catch (error: any) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' })
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const products = await Product.find({ category });

        let transformedProducts = products.map(product => {
            const productObj = product.toObject();

            if (!productObj.image || !productObj.image.data) {
                return res
                    .status(500)
                    .json({ message: 'Internal Server Error' })
            }

            const imageBase64 = productObj.image.data.toString('base64');
            return {
                ...productObj,
                image: `data:${productObj.image.contentType};base64,${imageBase64}`
            };
        });

        res
            .status(200)
            .json({ transformedProducts });
    } catch (err) {
        console.error(err);  
        res
            .status(500).
            json({ message: 'Internal Server Error' });
    }
};

export const getProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params
        const { decode } = req

        const product = await Product.findById(id)
        const user = await User.findById(decode?._id)

        if (!product)
            return res
                .status(404)
                .json({ message: 'This page does not exist' })

        const productObj = product.toObject();

        if (!productObj.image || !productObj.image.data) {
            return res
                .status(500)
                .json({ message: 'Internal Server Error' })
        }

        const imageBase64 = productObj.image.data.toString('base64');
        const transformedProduct = {
            ...productObj,
            image: `data:${productObj.image.contentType};base64,${imageBase64}`
        };

        const isPurchased = user?.productsPurchased.includes(productObj._id)

        res
            .status(200)
            .json({ transformedProduct, isPurchased })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' })
    }
}