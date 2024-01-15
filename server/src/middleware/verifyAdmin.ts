import { Response } from "express";
import { ExtendedRequest } from "./verifyToken";
import jwt from 'jsonwebtoken';

const verifyAdmin = async (req: ExtendedRequest, res: Response, next: any) => {
    try {
        const { token } = req.cookies

        if (!token)
            return res
                .status(401)
                .json({
                    message: "No Token",
                    isAuthenticated: false
                })

        console.log(process.env.JWT_SECRET);
        const decode = jwt.verify(token, `${process.env.JWT_SECRET}`)
        

        // @ts-ignore
        if (!decode.isAdmin)
            return res
                .status(403)
                .json({ message: 'You are not authorized to access this route' })

        req.decode = decode as ExtendedRequest['decode']
        next()
    } catch (err) {
        console.log(err);
    }
}

export default verifyAdmin