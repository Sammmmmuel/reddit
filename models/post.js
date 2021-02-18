const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../util/autopopulate");

const PostSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    subreddit: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});
PostSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Post", PostSchema);