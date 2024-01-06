import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stars: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
})

const Review = model('Review', reviewSchema)

export default Review