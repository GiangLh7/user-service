import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: String, unique: true, index: true },
    email: String,
    newEmail: String,
    password: String,
    firstName: String,
    lastName: String,
    language: String,
    profilePicture: String,
    gender: String,
    birthDate: Date,
    emailActivated: Boolean,
    terms: Boolean
});

const userModel = mongoose.model('user', userSchema, 'user');

export default userModel;