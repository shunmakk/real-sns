//ポスト用スキーマのモデル

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        min: 1,
        max: 100,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    }
},
 {timestamps: true}
)


module.exports = mongoose.model("Post", PostSchema)