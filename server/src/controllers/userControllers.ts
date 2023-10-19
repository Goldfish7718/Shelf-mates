import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/userModel"; 
import generateToken from "../middleware/generateToken";

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

        const { isAdmin } = user
        const payload = {
            username,
            fName,
            lName,
            isAdmin
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

        const { fName, lName, isAdmin } = user

        const payload = {
            fName,
            lName,
            username,
            isAdmin
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