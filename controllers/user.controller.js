const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = {
  getUser: async (req, res) => {
    const response = {};
    try {
      await User.find()
        .then((res) => {
          Object.assign(response, {
            status: 200,
            message: "Success",
            data: res,
          });
        })
        .catch((e) => {
          Object.assign(response, {
            status: 404,
            message: "Not Found",
          });
        });
    } catch {
      Object.assign(response, {
        status: 500,
        message: "Server Error",
      });
    }
    return res.status(response.status).json(response);
  },

  getUserById: async (req, res) => {
    const response = {};
    const { id } = req.params;
    try {
      await User.findOne({ _id: id })
        .then((res) => {
          Object.assign(response, {
            status: 200,
            messagge: "Succees",
            data: res,
          });
        })
        .catch((e) => {
          Object.assign(response, {
            status: 404,
            messagge: "Not Found",
          });
        });
    } catch {
      Object.assign(response, {
        status: 500,
        messagge: "Server Error",
      });
    }
    return res.status(response.status).json(response);
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
