const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, (req, res) => {

  res.json({ message: 'Protected profile data', user: req.user });
});

module.exports = router;
