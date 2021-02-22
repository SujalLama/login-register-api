const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
    
    const data = await User.findById(req.user._id);
    res.send(data);
})


module.exports = router;