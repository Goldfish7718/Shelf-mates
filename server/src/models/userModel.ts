import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fName: String,
    lName: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    productsPurchased: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

const User = model("User", userSchema)

export default User
