module.exports = (app, passport) => {
    app.route('/').get((req, res) => {
        res.render('index', {})
    })

    app.route('/login').get((req, res) => {
        res.render('login', {})
    })

    app.post('/login', passport.authenticate('local', {successRedirect: '/aaaa', failureRedirect: '/login', failureFlash: true}));
}