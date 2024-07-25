var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    tags: { type: [String], required: true },
    author: { type: String, trim: true, required: true },
    likes: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
