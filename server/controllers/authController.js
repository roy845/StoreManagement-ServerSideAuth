const { comparePassword, hashPassword } = require("../helpers/authHelper");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;
    //validations
    if (!username) {
      return res.send({ error: "User Name is Required" });
    }

    if (!password) {
      return res.send({ error: "Password is Required" });
    }

    //check user
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists please login",
      });
    }

    //regiser user
    const hashedPassword = await hashPassword(password);

    //save new user to db
    const user = await new UserModel({
      username,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: `User ${user.username} Register Successfully`,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    //validations
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Username is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const roles = Object.values(user.roles).filter(Boolean);

    //create token
    const token = jwt.sign(
      {
        UserInfo: {
          _id: user.id,
          username: user.username,
          roles: roles,
        },
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        username: user.username,
        roles: roles,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//get admin routes
const getAdminRoutes = (req, res) => {
  res.status(200).send({ ok: true });
};

//get user or admin routes
const getUserOrAdminRoutes = (req, res) => {
  res.status(200).send({ ok: true });
};

module.exports = {
  registerController,
  loginController,
  getUserOrAdminRoutes,
  getAdminRoutes,
};
