const express = require('express');
const router = express.Router();
const { getCurrentUser, updateUser ,getAllUsers,deleteUser } = require('../controllers/userController');
const checkAdmin = require('../middleware/checkAdmin'); // New middleware

// Get current user
router.get('/me', getCurrentUser);

// Get all users
router.get('/',checkAdmin, getAllUsers);

// Update current user
router.put('/me', updateUser);

// Delete user by ID
router.delete('/:userId',deleteUser);


module.exports = router;