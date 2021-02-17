const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    content: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at' },

    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});
module.exports = mongoose.model("Comment", CommentSchema);