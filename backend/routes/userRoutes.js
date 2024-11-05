const express = require('express');
const router = express.Router();
const { getCurrentUser, updateUser } = require('../controllers/userController');

router.get('/me', getCurrentUser);
router.put('/update', updateUser);

module.exports = router;