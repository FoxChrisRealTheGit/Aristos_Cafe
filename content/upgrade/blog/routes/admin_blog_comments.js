const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET Blog category model
const Category = require("../models/blogCategory")
// GET blog model
const Blog = require("../models/blog")

/*
* GET blog comments index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Blog.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
    })
    Blog.find(function (err, blogs) {
        if (err) { Logger.error(err)
        } else {
            res.render("../../upgrade/blog/views/blogs/blogs", {
                blogs: blogs,
                count: count
            })
        }
    })
})
