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
        res
            .status(500)
            .json({ message: "Internal server Error" })
    }
}

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params
        const limit = parseInt(req.query.limit as string) || 10
        const skip = parseInt(req.query.skip as string) || 0

        const reviewSize = await Review.find({ productId }).countDocuments()

        const end = skip * limit > reviewSize ? true : false

        const reviews = await Review.find({ productId })
            .sort({ stars: -1 })
            .skip(skip)
            .limit(limit)

        const transformedReviews = await Promise.all(reviews.map(async review => {
            const user = await User.findById(review.userId)

            return {
                ...review.toObject(),
                fName: user?.fName,
                lName: user?.lName,
                userId: review.userId
            }
        }))

        res
            .status(200)
            .json({ transformedReviews, end })
    } catch (err) {
        res
            .status(200)
            .json({ message: "Internal Server Error" })
    }
}