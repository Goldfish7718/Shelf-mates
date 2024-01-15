import { Request, Response } from "express";
import Product from "../models/productModel";
import { ExtendedRequest } from "../middleware/verifyToken";
import User from "../models/userModel";
import Review from "../models/reviewModel";
import Cart from "../models/cartModel";
import Order from "../models/orderModel";

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

        const reviews = await Review.find({ productId: productObj._id }).limit(6)

        const transformedReviews = await Promise.all(reviews.map(async review => {
            const user = await User.findById(review.userId)
            const { fName, lName } = user!

            return {
                ...review.toObject(),
                fName,
                lName
            }
        }))

        const sumStars = reviews.reduce((acc, currentValue) => {
            return acc + currentValue.stars;
        }, 0);
        
        const averageStars = Math.min(5, Math.floor((sumStars / reviews.length) * 100) / 100);

        const imageBase64 = productObj.image.data.toString('base64');
        const transformedProduct = {
            ...productObj,
            image: `data:${productObj.image.contentType};base64,${imageBase64}`,
            reviews: transformedReviews,
            reviewsLength: productObj.reviews.length,
            averageStars
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

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params

        await Cart.updateMany(
            { 'cartItems.productId': productId },
            { $pull: { cartItems: { productId: productId } } },
            { multi: true }
        )

        await Review.deleteMany(
            { 'productId': productId }
        )

        await Order.updateMany(
            { 'items.productId': productId },
            { $pull: { items: { productId: productId } } },
            { multi: true }
        )

        await User.updateMany(
            { 'productsPurchased': productId },
            { $pull: { productsPurchased: productId } },
            { multi: true }
        )
        
        await Product.findByIdAndDelete(productId)

        return res
            .status(200)
            .json({ message: "Product Deleted Succesfully" })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' })
    }
}