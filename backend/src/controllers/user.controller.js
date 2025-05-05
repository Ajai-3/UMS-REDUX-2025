import { ZodError } from "zod";
import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import { HttpStatus } from "../utils/httpStatusCode.js";
import { generateRefreshToken } from "../services/auth.service.js";
import { userLoginSchema, userRegistrationSchema } from "../validations/userValidation.js";

// ===========================================================================================================
// REGISTER USER
// ===========================================================================================================
// This controller is responsible for registering new users and saving their data to the database.
// ===========================================================================================================
export const registerUser = async (req, res) => {
    try {
        const validatedData = userRegistrationSchema.parse(req.body);

        const { name, email, password, image } = validatedData;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: "User already exist." });
        }

        const user = await userService.createUser({
            name,
            email,
            password,
            image,
        });

        const accessToken = user.generateAccessToken()
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(HttpStatus.CREATED).json({
            message: "User registered successfully.",
            user,
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors.map((err) => err.message);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: errorMessage });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message })
    }
};

// ===========================================================================================================
// LOGIN USER
// ===========================================================================================================
// This controller is responsible for logging the user into their account if they have an existing account.
// ===========================================================================================================
export const loginUser = async (req, res) => {
    try {
        const validatedData = userLoginSchema.parse(req.body)

        const { email, password } = validatedData;

        console.log(email, password)

        const user = await userModel.findOne({ email: email, role: "user" }).select("+password")
        if(!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid Email or Password" })
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid Email or Password" })
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(HttpStatus.OK).json({
            message: "User logined successfully.",
            user,
        });
        
    } catch (error) {
        if(error instanceof ZodError) {
            const errorMessages = error.errors.map(err => err.message)
            return res.status(HttpStatus.BAD_REQUEST).json({ message: errorMessages })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error: error.message })
    }
}

// ===========================================================================================================
// USER PROFILE
// ===========================================================================================================
// This controller is allow the logind user to see their profile.
// ===========================================================================================================
export const getProfile = (req, res) => {
  try {
    return res.status(HttpStatus.OK).json(req.user)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
  }
}

// ===========================================================================================================
// LOGOUT USER
// ===========================================================================================================
// This controller is allow the logined user to logout from their account.
// ===========================================================================================================
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(HttpStatus.OK).json({ message: "Logged out successfully." });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}
