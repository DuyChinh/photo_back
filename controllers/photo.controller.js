const { Photo } = require("../models/index");
//https://n54969-2102.csb.app/photos?userId=66359ec0efa3ce66748f5fbd
module.exports = {
  getPhotoByUserId: async (req, res) => {
    const response = {};
    const { userId } = req.query;
    try {
      await Photo.find({ user_id: userId })
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

  getPhotoById: async (req, res) => {
    const response = {};
    const { id } = req.params;
    try {
      await Photo.findById(id)
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
};
