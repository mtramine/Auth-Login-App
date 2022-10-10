const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

// Registration Page
router.get('/', (req, res) => {
    res.render(`register`);
});

// Register
router.post('/', usersController.userRegister);

module.exports = router;