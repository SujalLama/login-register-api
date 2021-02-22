const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

    //lets you validate\
    const {error} = registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    //checking if the user is already in the database

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists.');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});


//login
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

     //checking if the user exists
    const emailExist = await User.findOne({email: req.body.email});
    if(!emailExist) return res.status(400).send('Email doesn\'t exists.');

    //checking password is coorect
     const validPass = await bcrypt.compare(req.body.password, emailExist.password);
     if(!validPass) return res.status(400).send('Invalid Password.');

     //Create and assign a token
     const token = await jwt.sign({_id: emailExist._id}, process.env.TOKEN_SECRET);
     res.header('auth-token', token).send(token);
     
})

module.exports = router;