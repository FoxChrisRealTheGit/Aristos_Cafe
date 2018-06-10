const express = require("express")
const router = express.Router();
const auth = require("../../../config/auth")
const fs = require("fs-extra");
const Logger = require("../../../AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET user model
const User = require("../../../models/user")
/*
* GET admin settings
*/
router.get("/", isAdmin, function (req, res) {
    res.render("../../../includes/admin/views/settings/settings", {
        content: ""
    })

})

/*
* POST admin settings save
*/
router.post("/", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            res.render("../../../includes/admin/views/settings/settings", {
                content: ""
            })
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* GET admin settings cancel
*/
router.get("/cancel", isAdmin, function (req, res) {
    res.render("../../../includes/admin/views/index", {
        content: ""
    })
})

//Exports
module.exports = router;