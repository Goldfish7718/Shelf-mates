import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    }
})

const User = mongoose.model("User", userSchema)

export default User
