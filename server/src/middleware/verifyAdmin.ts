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

        const decode = jwt.verify(token, `${process.env.JWT_SECRET}`)

        // @ts-ignore
        if (!decode.isAdmin)
            return res
                .status(403)
                .json({ message: 'You are not authorized to access this route' })

        req.decode = decode as ExtendedRequest['decode']
        next()
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Sorry an error occured" })
    }
}

export default verifyAdmin