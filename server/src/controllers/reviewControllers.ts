import { Request, Response } from "express";
import Product from "../models/productModel";
import Review from "../models/reviewModel";
import User from "../models/userModel";
import { Types } from "mongoose";

export const addReview = async (req: Request, res: Response) => {
    try {
        const { productId, userId } = req.params;
        const { review, stars } = req.body;

        const user = await User.findById(userId);

        const productPurchased = user?.productsPurchased.includes(new Types.ObjectId(productId))

        if (!productPurchased)
            return res
                .status(403)
                .json({ message: 'Product is not purchased' })

        const userReview = await Review.create({
            productId,
            userId,
            stars,
            review
        })
        
        await Product.findByIdAndUpdate(productId, {
            $push: {
                reviews: userReview._id
            }
        })

        res
            .status(200)
            .json({ message: "Review Posted Successfully" })

    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal server Error" })
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        
        const review = await Review.findByIdAndDelete(reviewId)
        const { _id }: any = review

        await Product.findByIdAndUpdate(
            review?.productId,
            { $pull: { reviews: _id } },
        )

        res
            .status(200)
            .json({ message: "Review Deleted Successfully" })
    } catch (err) {
        console.log(err);
    }
}