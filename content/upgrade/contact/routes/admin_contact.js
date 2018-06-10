const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET contactMEssage model
const contactMessage = require("../models/contactMesssage")

// GET User model
const User = require("../../../../includes/models/user")
/*
* GET contact form
*/
router.get("/", isAdmin, function (req, res) {
    // Category.count(function (err, c) {
    //     count = c;
    // })
    res.render("../../upgrade/contact/views/contact");
})


/*
* post contact form
*/
router.post("/", function (req, res) {
    req.checkBody("name", "Namme must have a value.").notEmpty();
    req.checkBody("content", "content must have a value.").notEmpty();
    req.checkBody("subject", "Subject must have a value.").notEmpty();
    req.checkBody("email", "email must have a value.").isEmail();

    let content = req.body.content;
    let email = req.body.email;
    let subject = req.body.subject;
    let name = req.body.name;

    let errors = req.validationErrors();

    if (errors) {
        req.session.error = errors;
        res.redirect("/contact");
    } else {

        let message = new contactMessage({
            name: name,
            subject: subject,
            content: content,
            email: email
        });

        message.save(function (err) {
            if (err) { Logger.error(err) };
        })

        req.flash("success", "Message sent!");
        res.redirect("/contact");
    }
})

//Exports
module.exports = router;