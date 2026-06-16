import { Response } from "express";
import { ExtendedRequest } from "./verifyToken";
import jwt from 'jsonwebtoken';

const verifyAdmin = async (req: ExtendedRequest, res: Response, next: any) => {
    try {
        console.log("COOKIE TOKEN: ", req.cookies.token);
        console.log("HEADER TOKEN: ", req.headers["x-auth-header"]);
        
        const token = req.cookies.token || req.headers["x-auth-header"]

        if (req.cookies.token) {
        console.log("Token extracted from cookies");
        } else if (req.headers["x-auth-header"]) {
            console.log("Token extracted from header");
        } else {
            console.log("No token found");
        }    

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
        if (err instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({
                    message: err.message,
                    isAuthenticated: false
                })
        }
        return res
            .status(500)
            .json({ message: "Internal server error" })
    }
}

export default verifyAdmin