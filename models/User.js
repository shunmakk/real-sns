//ユーザースキーマのモデルを確認
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 70,
    },
    city: {
        type: String,
        max: 50,
    },
    likepeople:{
        type: String
    }
},
{timestamps: true}  //データを格納した日付
);


module.exports = mongoose.model("User", UserSchema);