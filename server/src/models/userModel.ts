import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    username: String,
    password: String
})

const User = mongoose.model("User", userSchema)

export default User
