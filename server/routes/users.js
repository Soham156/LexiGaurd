const express = require("express");
const { UserStorage } = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/users/test
// @desc    Test users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ message: "Users routes working" });
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authenticateToken, (req, res) => {
  try {
    const user = UserStorage.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile retrieved successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    const user = UserStorage.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = UserStorage.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    // Update user data
    const updatedData = {};
    if (name) updatedData.name = name.trim();
    if (email) updatedData.email = email.toLowerCase().trim();

    const updatedUser = UserStorage.update(userId, updatedData);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get("/", authenticateToken, (req, res) => {
  try {
    const currentUser = UserStorage.findById(req.user.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin role required.",
      });
    }

    const users = UserStorage.getAll().map((user) => user.toJSON());

    res.json({
      message: "Users retrieved successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

module.exports = router;
