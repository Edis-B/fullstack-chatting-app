import mongoose, { Schema, Types } from "mongoose"

const userSchema = new Schema({
    username: String,
    passwordHash: String,
    email: String,
    friends: [{
        _id: false,
        friend: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }]
})

const userModel = mongoose.model('User', userSchema);

export default userModel;