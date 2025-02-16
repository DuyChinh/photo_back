const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("../models/index");
const { Blacklist } = require("../models/index");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

module.exports = {
  login: async (req, res) => {
    const response = {};
    //Validate
    const { username, password } = req.body;
    if (!username || !password) {
      Object.assign(response, {
        status: 400,
        message: "username or password is required!",
      });
    } else {
      const users = await User.find();
      // console.log(users);
      const user = await User.findOne({ username });
      // console.log(user);
      if (!user) {
        Object.assign(response, {
          status: 400,
          message: "username or password is incorrect!",
        });
      } else {
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
          Object.assign(response, {
            status: 400,
            message: "username or password is incorrect!",
          });
        } else {
          const { JWT_SECRET, JWT_EXPIRE } = process.env;
          const accessToken = jwt.sign(
            {
              userId: user.id,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE },
          );
          Object.assign(response, {
            status: 200,
            message: "Success",
            access_token: accessToken,
            userData: user,
          });
        }
      }
      res.status(response.status).json(response);
    }
  },

  googleSignIn: async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "Token is required",
      });
    }
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { picture, email, name } = payload;
  
      let user = await User.findOne({ username: email });
      if (!user) {
        user = await User.create({
          username: email,
          password: "",
          fullname: name,
          description: "",
          dob: "",
          phone: "",
          address: "",
          description: "",
          follow: [],
          occupation: "",
          avatar: picture,
          createtime: new Date(),
        });
      }
  
      const { JWT_SECRET, JWT_EXPIRE } = process.env;
      const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  
      return res.status(200).json({
        status: 200,
        message: "Google sign in successful",
        accessToken,
        userData: user.toObject(),
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error",
        error: error.message,
      });
    }
  },

  profile: async (req, res) => {
    const response = {};
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
      Object.assign(response, {
        status: 401,
        message: "Unauthorize",
      });
    } else {
      try {
        const { JWT_SECRET } = process.env;
        const { userId } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not exist");
        }
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: user,
        });
      } catch {
        Object.assign(response, {
          status: 401,
          message: "Unauthorize",
        });
      }
    }

    return res.status(response.status).json(response);
  },

  signup: async (req, res) => {
    const response = {};
    const { username, password, fullname } = req.body;
    const userExist = await User.findOne({ username });
    if (userExist) {
      Object.assign(response, {
        status: 400,
        message: "User already exist!",
      });
      return res.status(response.status).json(response);
    }
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const user = await User.create({
        username: username,
        password: hash,
        fullname: fullname,
        description: "",
        dob: "",
        phone: "",
        address: "",
        description: "",
        follow: [],
        occupation: "",
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: user,
      });
    } catch {
      Object.assign(response, {
        status: 500,
        message: "Server Error",
      });
    }
    return res.status(response.status).json(response);
  },

  logout: async (req, res) => {
    const { accessToken, expired } = req.user;
    const token = await Blacklist.findOne({ token: accessToken });
    if (!token) {
      await Blacklist.create({
        token: accessToken,
        expired: expired,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Success",
    });
  },

  changePassword: async (req, res) => {
    const response = {};
    const { username } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Username not exist!",
      });
    }
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const user = await User.updateOne(
        { username: username },
        { password: hash },
      );
      Object.assign(response, {
        status: 200,
        message: "Succees",
        data: user,
      });
    } catch {
      Object.assign(response, {
        status: 500,
        message: "Server Error",
      });
    }
    return res.status(response.status).json(response);
  },
};
