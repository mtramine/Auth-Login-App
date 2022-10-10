const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

const { validateToken } = require('../auth');

// Users
router.get('/', validateToken, usersController.userListing);

module.exports = router;