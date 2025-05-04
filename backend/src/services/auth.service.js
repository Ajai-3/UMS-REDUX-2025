import jwt from "jsonwebtoken"
// ===========================================================================================================
// GENERATE REFRESH TOKEN
// ===========================================================================================================
// This method is used to generate a refresh token for the user, which is valid for 7 days.
// ===========================================================================================================
export const generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}
