module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'You need to login to see that page.');
        res.redirect('/users/login')
    }
}