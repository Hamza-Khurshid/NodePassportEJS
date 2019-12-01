var express = require('express');
var router = express.Router();
var User = require('../modals/User');
var bcrypt = require('bcryptjs');

// Render Login Page
router.get('/login', (req, res) => res.render('login'))

// Render Register Page
router.get('/register', (req, res) => res.render('register'))

router.post('/register', (req, res) => {
    let { name, email, password, password2 } = req.body;

    // Validation
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'All fields are required.' })
    }

    if(password.length < 8) {
        errors.push({ msg: 'Password length should be minimum 8 characters.' })
    }

    if(password != password2) {
        errors.push({ msg: "Both password don't match." })
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Save user
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User already exists with this email
                    errors.push({ msg: 'Email already registered.' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    let user = new User({
                        name,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, (hash, salt) => 
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if(err) throw err;
                            
                            user.password = hash;

                            //save user to db
                            user.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are registered successfully.')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    )
                }
            })
    }
})

module.exports = router;