const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;
// GET blog model
const Blog = require("../models/blog")
//GET media model
const Media = require("../../../../includes/models/media")
// GET Blog Category model
const Category = require("../models/blogCategory")
// GET user model
const User = require("../../../../includes/models/user")
/*
* GET blog index
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
            res.render("../../upgrade/blog/views/blogs", {
                blogs: blogs,
                count: count
            })
        }
    })
})

/*
* GET add blog
*/
router.get("/add-blog", isAdmin, function (req, res) {
    let title = "";
    let slug = "";
    let content = "";
    let author = "";
    let description = "";
    let keywords = "";
    Category.find(function (err, categories) {
        if (err) { Logger.error(err) };
        Media.find({}, function (err, media) {
            if (err) { Logger.error(err) };
            res.render("../../upgrade/blog/views/add_blog", {
                title: title,
                slug: slug,
                content: content,
                categories: categories,
                media: media,
                author: author,
                description: description,
                keywords: keywords
            })
        })
    })
})

/*
* POST add blog
*/
router.post("/add-blog", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();

            let title = req.body.title;
            let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
            if (slug == "") {
                slug = title.replace(/\s+/g, "-").toLowerCase();
            }
            let content = req.body.content;
            let category = req.body.category;
            let author = req.body.author;
            let description = req.body.description;
            let keywords = req.body.keywords;

            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../upgrade/blog/views/add_blog", {
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content,
                    category: category,
                    author: author,
                    description: description,
                    keywords: keywords
                })
            } else {
                Blog.findOne({ slug: slug }, function (err, blog) {
                    if (err) { Logger.error(err) };
                    if (blog) {
                        req.flash("danger", "Blog slug exists, chooser another.")
                        return res.render("../../upgrade/blog/views/add_blog", {
                            title: title,
                            slug: slug,
                            content: content,
                            category: category,
                            author: author,
                            description: description,
                            keywords: keywords
                        });
                    } else {
                        let blog = new Blog({
                            title: title,
                            slug: slug,
                            content: content,
                            category: category,
                            author: author,
                            description: description,
                            keywords: keywords,
                            published: new Date()
                        });
                        blog.save(function (err) {
                            if (err) { Logger.error(err) };

                            req.flash("success", "Blog added!");
                            res.redirect("/admin/blogs");
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
* GET edit blog
*/
router.get("/edit-blog/:id", isAdmin, function (req, res) {
    Category.find(function (err, categories) {
        Blog.findById(req.params.id, function (err, blog) {
            if (err) { Logger.error(err)
            } else {
                Media.find({}, function (err, media) {
                    if (err) { Logger.error(err) };
                    res.render("../../upgrade/blog/views/edit_blog", {
                        title: blog.title,
                        slug: blog.slug,
                        content: blog.content,
                        categories: categories,
                        id: blog._id,
                        media: media,
                        author: blog.author,
                        description: blog.description,
                        keywords: blog.keywords,
                        selectedCat: blog.category
                    })
                })
            }
        })
    })
})


/*
* POST edit blog
*/
router.post("/edit-blog/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();

            let title = req.body.title;
            let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
            if (slug == "") {
                slug = title.replace(/\s+/g, "-").toLowerCase();
            }
            let content = req.body.content;
            let id = req.params.id;
            let category = req.body.category;
            let author = req.body.author;
            let description = req.body.description;
            let keywords = req.body.keywords;

            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../upgrade/blog/views/edit_blog", {
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content,
                    category: category,
                    id: id,
                    author: blog.author,
                    description: blog.description,
                    keywords: blog.keywords
                })
            } else {
                Blog.findOne({ slug: slug, _id: { '$ne': id } }, function (err, page) {
                    if (err) { Logger.error(err) };
                    if (page) {
                        req.flash("danger", "Blog slug exists, chooser another.")
                        return res.render("../../upgrade/blog/views/edit_blog", {
                            title: title,
                            slug: slug,
                            content: content,
                            category: category,
                            id: id,
                            author: blog.author,
                            description: blog.description,
                            keywords: blog.keywords
                        });
                    } else {
                        Blog.findById(id, function (err, blog) {
                            if (err) { Logger.error(err)
                            } else {
                                blog.title = title;
                                blog.slug = slug;
                                blog.content = content;
                                blog.category = category;
                                blog.author = author;
                                blog.description = description;
                                blog.keywords = keywords;

                                blog.save(function (err) {
                                    if (err) { Logger.error(err) };

                                    req.flash("success", "Blog edited!");
                                    res.redirect("/admin/blogs");
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
* GET delete blog
*/
router.get("/delete-blog/:id", isAdmin, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {

        req.flash("success", "Blog deleted!")
        res.redirect("/admin/blogs/")
    })
})

//Exports
module.exports = router;