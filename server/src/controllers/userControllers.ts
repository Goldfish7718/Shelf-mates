import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/userModel"; 
import generateToken from "../middleware/generateToken";
import Cart from "../models/cartModel";
import Address from "../models/addressModel";
import Order from "../models/orderModel";
import Review from "../models/reviewModel";
import Product from "../models/productModel";

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, password, fName, lName } = req.body

        if (!username || !password || !fName || !lName)
            return res  
                .status(400)
                .send({ message: "All Inputs are required" })

        const potentialUser = await User.findOne({ username })

        if (potentialUser) {
            return res
                .status(400)
                .json({ message: 'User Already Exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User
            .create({
                username,
                password: hashedPassword,
                fName,
                lName
            })

        const { isAdmin, _id } = user

        await Cart.create({
            userId: _id
        })

        const payload = {
            username,
            fName,
            lName,
            isAdmin,
            _id
        }

        const token = generateToken(payload)

        res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({ message: "Account Created" })

    } catch (err) {
        res
            .status(500)
            .json({ message: 'An error occured.Please try again later.' })
    }
} 

export const login = async (req: Request, res: Response) => {
    try {
        const {
            username, 
            password
        } = req.body

        if (!username || !password)
            return res  
                .status(400)
                .send({ message: "All Inputs are required" })

        const user = await User.findOne({ username })

        if (!user) 
            return res
                .status(400) 
                .json({ message: "User Does not exist" })

        const match = await bcrypt.compare(password, user.password as string)

        if (!match)
            return res
                .status(400)
                .json({ message: "Incorrect Credentials" })

        const { fName, lName, isAdmin, _id } = user

        const payload = {
            fName,
            lName,
            username,
            isAdmin,
            _id,
        }

        const token = generateToken(payload)

        res
            .status(200)
            .cookie('token', token, {
                sameSite: 'none',
                secure: true,
                httpOnly: true
            })
            .json({ message: "Succesfully logged in", fName })

    } catch (err) {
        res
            .status(500)
            .json({ message: "A Problem Occured" })

    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { newUser } = req.body;

        const currentUser = await User.findById(userId);

        const usernameEquals = currentUser?.username === newUser.username;
        const fNameEquals = currentUser?.fName === newUser.fName;
        const lNameEquals = currentUser?.lName === newUser.lName;

        if (usernameEquals && fNameEquals && lNameEquals) {
            return res
                .status(200)
                .json({ message: "Changes Saved" });
        }

        if (!usernameEquals) {
            const potentialUser = await User.findOne({ username: newUser.username });

            if (potentialUser && potentialUser._id.toString() !== currentUser?._id.toString()) {
                return res
                    .status(400)
                    .json({ message: "This username is already taken" });
            }
        }

        const updatedFields: any = {};

        if (!usernameEquals) {
            updatedFields.username = newUser.username;
        }
        if (!fNameEquals) {
            updatedFields.fName = newUser.fName;
        }
        if (!lNameEquals) {
            updatedFields.lName = newUser.lName;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true }
        );

        const payload = updatedUser!.toObject();
        const token = generateToken(payload);

        res
            .status(200)
            .clearCookie('token')
            .cookie('token', token, {
                sameSite: 'none',
                secure: true,
                httpOnly: true
            })
            .json({ message: "Saved Changes", updatedUser });
    } catch (err) {
        res
            .status(500)    
            .json({ message: "A Problem Occurred" });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { securityPassword, newPassword } = req.body

        if (!userId || !securityPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" })
        }

        const potentialUser = await User.findById(userId)
        
        const match = await bcrypt.compare(securityPassword, potentialUser?.password as string)

        if (!match)
            return res
                .status(400)
                .json({ message: "The Entered password does not match with your current password" })

        const updatedPassword = await bcrypt.hash(newPassword, 10)        

        potentialUser!.password = updatedPassword
        await potentialUser?.save()

        res
            .status(200)
            .json({ message: "Password changed successfully" })

    } catch (err) {
        res
            .status(500)
            .json({ message: "A Problem Occured" })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { securityPassword } = req.body

        const potentialUser = await User.findById(userId)
        
        const match = await bcrypt.compare(securityPassword, potentialUser?.password as string)

        if (!match)
            return res
                .status(400)
                .json({ message: "The Entered password does not match with your current password" })

        const deletedReviews = await Review.find({ userId })

        await User.findByIdAndDelete(userId)
        await Address.deleteMany({ userId })
        await Cart.findOneAndDelete({ userId })
        await Order.deleteMany({ userId })
        await Review.deleteMany({ userId })

        await Product.updateMany(
            { reviews: { $in: deletedReviews.map(review => review._id) } },
            { $pull: { reviews: { $in: deletedReviews.map(review => review._id) } } }
        );

        res
            .status(200)
            .json({ message: "User Deleted Successfully" })
    } catch (err) {
        console.log(err);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res
            .clearCookie('token')
            .json({ message: 'Logged out' })
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ message: "Sorry an error occured" })
    }
}