import userModel from "../models/user.model.js";
// ===========================================================================================================
// CREATE USER
// ===========================================================================================================
// This function creates a new user and saves their information to the database.
// ===========================================================================================================
const createUser = async ({ name, email, password, image }) => {
    if(!name || !email || !password || !image) {
        throw new Error("All fields are required.")
    }
    try {

        const user = await userModel.create({
            name,
            email,
            password,
            image
        })

        return user;
        
    } catch (error) {
        throw new Error("Error creating new user", + error.message);
    }
}

export default { createUser }