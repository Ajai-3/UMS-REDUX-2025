import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { HttpStatus } from "../utils/httpStatusCode.js"

// ===========================================================================================================
// AUTH USER
// ===========================================================================================================
// This middleware authenticates the user by verifying the JWT token from cookies or headers.
// ===========================================================================================================
export const authUser = async (req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        if(!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id).select("-password")

        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User not found" });
        }
        
        if (user.role !== 'user') {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access denied. Regular users only." });
        }        

        req.user = user;
        return next()
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "internal server error", error: error.message })
    }
}