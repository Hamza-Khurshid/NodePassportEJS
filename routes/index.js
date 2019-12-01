var express = require('express');
var router = express.Router();
const { ensureAuth } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'))

router.get('/dashboard', ensureAuth,  (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
)

module.exports = router;