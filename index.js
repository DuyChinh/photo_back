const cors = require("cors");
var session = require("express-session");
const express = require("express");
const userRouter = require("./router/user");
const photoRouter = require("./router/photo");
const authRouter = require("./router/auth");
const uploadRouter = require("./router/upload");
const commentRouter = require("./router/comment");
const replyRouter = require("./router/reply");
const notificationRouter = require("./router/notification");
require("dotenv").config();
const multer = require("multer");


const app = express();

app.use(
  session({
    secret: "dc",
    resave: false,
    saveUninitialized: true,
  }),
);

// const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/users", userRouter);
app.use("/photos", photoRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/comments", commentRouter);
app.use("/reply", replyRouter);
app.use("/notifications", notificationRouter);
app.get("/", (req, res) => {
  res.send("Hello");
});

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
