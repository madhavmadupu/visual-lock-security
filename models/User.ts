import mongoose from 'mongoose'

const coordSchema = new mongoose.Schema({
    x: Number,
    y: Number
})

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordCoords: [coordSchema], 
})

export default mongoose.models.User || mongoose.model('User', userSchema)
