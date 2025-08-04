import mongoose from "mongoose";

const blacklistedTokensSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Token will be removed automatically after 1   
  }
});

export const BlackListedToken = mongoose.model("BlackListedToken", blacklistedTokensSchema);