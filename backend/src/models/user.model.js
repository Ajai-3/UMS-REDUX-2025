import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Name must be at least 3 characters long."],
        maxlength: [20, "Name must not exceed 20 characters."],
        match: [/^[a-zA-Z\s\-]+$/, "Name must contain only alphabetic characters, spaces, or hyphens."],
        set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address."],
    },
    image: {
        type: String,
        required: [true, "Image URL is required."],
        match: [
            /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
            "Please provide a valid image URL (http/https and ends in jpg, png, etc)."
        ]
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin"],
            message: "Role must be either 'user' or 'admin'."
        },
        default: "user",
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [8, "Password must be at least 8 characters long."],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character."
        ]
    }
}, {
    timestamps: true
})

// ===========================================================================================================
// GENERATE ACCESS TOKEN FOR USERS
// ===========================================================================================================
// This method is used to generate an access token for the user, which is valid for 15 minutes.
// ===========================================================================================================
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15m"
    })
}

// ===========================================================================================================
// HARSH PASSWORD
// ===========================================================================================================
// This will automatically run when the password field changes.
//  It helps to hash the password before saving it to the database.
// ===========================================================================================================
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

// ===========================================================================================================
// COMPARE THE PASSWORD
// ===========================================================================================================
// This method is used to compare the plain password with the hashed password during login.
// ===========================================================================================================
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("User", userSchema)

export default userModel
