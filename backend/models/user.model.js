import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least three characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least three characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be 5 characters long"]
    },
    password: {
        type: String,
        required: true,
        select: false // Password won't be returned in queries unless explicitly requested
    },
    socketId: {
        type: String // Added type for socketId (optional)
    }
});

// Generate JWT Token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET); // ✅ Fixed: `this._id`
    return token;
};

// Compare passwords (for login)
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Hash password (static method)
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

export const User = mongoose.model("User", userSchema);