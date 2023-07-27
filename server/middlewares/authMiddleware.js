const jwt = require("jsonwebtoken");
const { ROLES } = require("../Roles/Roles");

// User or Admin access
const isUserOrAdmin = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    if (
      !decode.UserInfo.roles.includes(ROLES.User) &&
      !decode.UserInfo.roles.includes(ROLES.Admin)
    ) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in user or admin middleware",
    });
  }
};

// Admin access
const isAdmin = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    if (!decode.UserInfo.roles.includes(ROLES.Admin)) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

module.exports = { isUserOrAdmin, isAdmin };
