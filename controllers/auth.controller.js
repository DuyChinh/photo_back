const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("../models/index");
const { Blacklist } = require("../models/index");
require("dotenv").config();

module.exports = {
  login: async (req, res) => {
    const response = {};
    //Validate
    const { username, password } = req.body;
    if (!username || !password) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
      });
    } else {
      const user = await User.findOne({ username: username });
      if (!user) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
        });
      } else {
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
          Object.assign(response, {
            status: 400,
            message: "Bad Request",
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
          });
        }
      }
      res.status(response.status).json(response);
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
    const { username, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
      try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const user = await User.create({
          username: username,
          password: hash,
          first_name: username,
          last_name: "",
          location: "PTIT, VN",
          description: "I can work anything!",
          occupation: "Developer",
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
    } else {
      Object.assign(response, {
        status: 400,
        message: "Password and confirm password is different!",
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
};
