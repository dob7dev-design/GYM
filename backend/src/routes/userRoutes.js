const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, userController.getMyProfile);

router.delete('/me', authMiddleware, userController.deleteMyAccount)

module.exports = router;
