import { z } from "zod"

// ===========================================================================================================
// USER REGISTRATION SCHEMA
// ===========================================================================================================
// This schema validates the user registration data before saving it to the database.
// ===========================================================================================================
export const userRegistrationSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long.")
        .max(20, "Name must not exceed 20 characters.")
        .regex(/^[a-zA-Z\s\-]+$/, "Name must contain only alphabetic characters, spaces, or hyphens.")
        .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),

    email: z
        .string()
        .email("Please provide a valid email address.")
        .min(1, "Email is required."),

    image: z
        .string()
        .refine(
            (val) =>
                /^https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp)$/i.test(val),
            {
                message:
                    "Please provide a valid image URL (http/https and ends in jpg, png, etc)."
            }
        ),

    role: z
        .string()
        .refine((value) => ["user", "admin"].includes(value), "Role must be either 'user' or 'admin'")
        .default("user"),

    password: z
        .string()
        .refine(
            (val) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
            {
                message:
                    "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
            }
        )
});

// ===========================================================================================================
// USER LOGIN SCHEMA
// ===========================================================================================================
// This schema validates the user login data (email and password) before authenticating the user.
// ===========================================================================================================
export const userLoginSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address.")
        .min(1, "Email is required."),

    password: z
        .string()
        .refine(
            (val) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
            {
                message:
                    "Invalid Email or Password",
            }
        )
})

// ===========================================================================================================
// ADMIN LOGIN SCHEMA
// ===========================================================================================================
// This schema validates the admin login data (email and password) before authenticating the admin.
// ===========================================================================================================
export const adminLoginSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address.")
        .min(1, "Email is required."),

    password: z
        .string()
        .refine(
            (val) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
            {
                message:
                    "Invalid Email or Password",
            }
        )
})

// ===========================================================================================================
// UPDATE PROFILE SCHEMA
// ===========================================================================================================
// This schema validates the user profile update data before updating the user's information.
// ===========================================================================================================
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long.")
        .max(20, "Name must not exceed 20 characters.")
        .regex(/^[a-zA-Z\s\-]+$/, "Name must contain only alphabetic characters, spaces, or hyphens.")
        .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),

    email: z
        .string()
        .email("Please provide a valid email address.")
        .min(1, "Email is required."),

    image: z
        .string()
        .refine(
            (val) =>
                /^https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp)$/i.test(val),
            {
                message:
                    "Please provide a valid image URL (http/https and ends in jpg, png, etc)."
            }
        )
})
