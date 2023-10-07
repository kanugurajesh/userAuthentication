import mongoose from "mongoose";

// CREATING A SCHEMA FOR THE USER MODEL
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
    }},
    {timestamps:true}
);

// EXPORTING THE USER MODEL
export default mongoose.model("User", UserSchema);