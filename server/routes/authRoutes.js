const express = require("express");
const {
  registerController,
  loginController,
  getAdminRoutes,
  getUserOrAdminRoutes,
} = require("../controllers/authController");

const { isUserOrAdmin, isAdmin } = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//GET USER OR ADMIN ROUTES
router.get("/userOrAdminRoutes", isUserOrAdmin, getUserOrAdminRoutes);

//GET USER OR ADMIN ROUTES
router.get("/adminRoutes", isAdmin, getAdminRoutes);

module.exports = router;
