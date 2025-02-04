require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.URL_MONGODB;
mongoose.connect(url);
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
});
const User = mongoose.model("users", userSchema);
const photoSchema = new mongoose.Schema({
  user_id: String,
  img: String,
});

const Photo = mongoose.model("photos", photoSchema);

const blackListSchema = new mongoose.Schema({
  token: String,
  expired: Date,
});
const Blacklist = mongoose.model("blackList", blackListSchema);

const commentSchema = new mongoose.Schema({
  user_id: String,
  photo_id: String,
  username: String,
  description: String,
  time: Date,
});
const Comment = mongoose.model("comments", commentSchema);

const replyCommentSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  description: String,
  time: Date,
  reply_to: String,
});

const Replycomment = mongoose.model("replyComment", replyCommentSchema);

module.exports = { User, Photo, Blacklist, Comment, Replycomment };
