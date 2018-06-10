const express = require("express")
const router = express.Router();
const auth = require("../../../config/auth")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const fs = require("fs-extra");
const Logger = require("../../../AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET user model
const User = require("../../../models/user")

/*
* GET user controls index
*/
router.get("/", isAdmin, function (req, res) {
    User.find({ admin: 1 }, function (err, user) {
        if (err) { Logger.error(err) };
        res.render("../../../includes/admin/views/users/users", {
            content: "",
            user: user
        })
    })
})

/*
* GET add admin user
*/
router.get("/add-admin", isAdmin, function (req, res) {

    let title = ""

    res.render("../../../includes/admin/views/users/add_users", {
        content: "",
        title: title
    })
})


/*
* POST add admin user
*/
router.post("/add-admin", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let name = req.body.name;
            let email = req.body.email;
            let username = req.body.username;
            let password = req.body.password;
            let password2 = req.body.password2;
            let admin = ""
            if (req.body.admin == "yes") {
                admin = 1;
            } else {
                admin = 0;
            }

            req.checkBody("name", "Name is required").notEmpty();
            req.checkBody("email", "Email is required").isEmail();
            req.checkBody("username", "Username is required").notEmpty();
            req.checkBody("password", "Password is required").notEmpty();
            req.checkBody("password2", "Passwords do not match").equals(password);

            let errors = req.validationErrors();

            if (errors) {
                res.render("../../../includes/admin/views/users/add_users", {
                    errors: errors,
                    user: null,
                })
            } else {
                User.findOne({ username: username }, function (err, user) {
                    if (err) { Logger.error(err) };
                    if (user) {
                        req.flash("danger", "Username exists, choose another!")
                        res.redirect("/admin/user-controls/add-users")
                    } else {
                        let user = new User({
                            name: name,
                            email: email,
                            username: username,
                            password: password,
                            admin: admin
                        });

                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) { Logger.error(err) };
                            bcrypt.hash(user.password, salt, function (err, hash) {
                                if (err) { Logger.error(err) };

                                user.password = hash;

                                user.save(function (err) {
                                    if (err) { Logger.error(err)
                                    } else {
                                        req.flash("success", "You are now registered!")
                                        res.redirect("/admin/user-controls")
                                    }
                                })
                            })
                        })
                    }
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})


/*
* GET edit admin user
*/
router.get("/edit-admin/:id", isAdmin, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) { Logger.error(err) };
        res.render("../../../includes/admin/views/users/edit_users", {
            content: "",
            user: user,
            id: user._id
        })
    })
})

/*
* POST edit admin user
*/
router.post("/edit-admin/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let name = req.body.name
            let username = req.body.username
            let id = req.params.id
            let admin = ""
            if (req.body.admin === "yes") {
                admin = 1;
            } else {
                admin = 0;
            }

            req.checkBody("name", "Name is required").notEmpty();
            req.checkBody("username", "Username is required").notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                res.render("../../../includes/admin/views/users/edit_users", {
                    errors: errors,
                    user: null,
                })
            } else {
                User.findOne({ username: username }, function (err, user) {
                    if (err) { Logger.error(err) };
                    if (user) {
                        req.flash("danger", "Username exists, choose another!")
                        res.redirect("/admin/user-controls/edit-admin/" + id)
                    } else {
                        User.findById(id, function (err, user) {
                            if (err) { Logger.error(err)
                            } else {
                                user.username = username;
                                user.name = name;
                                user.admin = admin;

                                user.save(function (err) {
                                    if (err) { Logger.error(err)
                                    } else {
                                        req.flash("success", "You are now registered!")
                                        res.redirect("/admin/user-controls")
                                    }
                                })
                            }
                        })
                    }
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* GET remove admin user
*/
router.get("/remove-admin/:id", isAdmin, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) { Logger.error(err) };
        user.admin = 0;
        user.save(function (err) {
            if (err) { Logger.error(err)
            } else {
                req.flash("success", "Admin removed!")
                res.redirect("/admin/user-controls")
            }
        })
    })
})

//Exports
module.exports = router;