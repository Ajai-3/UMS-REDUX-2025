import jwt from "jsonwebtoken"
import userModel from "../models/user.model";
import { HttpStatus } from "../utils/httpStatusCode.js";

// ===========================================================================================================
// AUTH ADMIN
// ===========================================================================================================
// This middleware authenticates the admin by verifying the JWT token from cookies or headers.
// ===========================================================================================================
export const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await userModel.findById(decoded._id).select("-password");

        if (!admin) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        if (admin.role !== "admin") {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        req.admin = admin;

        return next();
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message });
    }
};