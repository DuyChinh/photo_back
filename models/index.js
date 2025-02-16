require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.URL_MONGODB;
mongoose.connect(url);
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  fullname: String,
  address: String,
  dob: Date,
  phone: String,
  description: String,
  follow: Array,
  occupation: String,
  avatar: { type: String, default: ""},
  created_at: { type: Date, default: Date.now },
});
const User = mongoose.model("users", userSchema);
const photoSchema = new mongoose.Schema({
  user_id: String,
  img: String,
  name: String,
  description: String,
  share_status: String,
  love: Array,
  created_at: Date,
});

const Photo = mongoose.model("photos", photoSchema);

const blackListSchema = new mongoose.Schema({
  token: String,
  expired: Date,
});
const Blacklist = mongoose.model("blackList", blackListSchema);

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  photo_id: { type: mongoose.Schema.Types.ObjectId, ref: "photos", required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "comments", default: null }, 
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  avatar: { type: String, default: "" },
});

const Comment = mongoose.model("comments", commentSchema);

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, 
  user_work_id: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true }, 
  read: { type: Boolean, default: false }, 
  created_at: { type: Date, default: Date.now }, 
  photos: { type: Array }, 
});

const Notification = mongoose.model("notifications", notificationSchema);

const replyCommentSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  description: String,
  time: Date,
  reply_to: String,
});

const Replycomment = mongoose.model("replyComment", replyCommentSchema);

module.exports = { User, Photo, Blacklist, Comment, Replycomment, Notification };
