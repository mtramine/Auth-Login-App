const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

// Login Page
router.get('/', (req, res) => {
    res.render(`login`);
});

// Login
router.post('/', usersController.userLogin);

module.exports = router;