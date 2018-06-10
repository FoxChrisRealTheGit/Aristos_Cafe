const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;
// GET Blog category model
const Category = require("../models/blogCategory")
// GET user model
const User = require("../../../../includes/models/user")
/*
* GET category index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Category.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
    })
    Category.findOne({ title: "General" }, function (err, categories) {
        if (err) { Logger.error(err) };
        if (!categories) {
            let category = new Category({
                title: "General",
                slug: "general",
                author: "",
                description: "",
                keywords: ""
            });
            category.save(function (err) {
                if (err) { Logger.error(err) };
                Category.find(function (err, categories) {
                    if (err) { Logger.error(err)
                    } else {
                        req.app.locals.blogcategories = categories;
                    }
                })
            })
        }
    })

    Category.find(function (err, categories) {
        if (err) { Logger.error(err)
        } else {
            res.render("../../upgrade/blog/views/categories/blog_categories", {
                categories: categories,
                count: count
            })
        }
    })
})

/*
* GET add category
*/
router.get("/add-blog-category", isAdmin, function (req, res) {
    let title = "";
    let author = "";
    let description = "";
    let keywords = "";

    res.render("../../upgrade/blog/views/categories/add_blog_category", {
        title: title,
        description: description,
        author: author,
        keywords: keywords
    })
})

/*
* POST add category
*/
router.post("/add-blog-category", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let errors = req.validationErrors();
            let description = req.body.description;
            let author = req.body.author;
            let keywords = req.body.keywords;
            if (errors) {
                return res.render("../../upgrade/blog/views/categories/add_blog_category", {
                    errors: errors,
                    title: title,
                    description: description,
                    author: author,
                    keywords: keywords
                })
            } else {
                Category.findOne({ slug: slug }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, choose another.")
                        return res.render("../../upgrade/blog/views/categories/add_blog_category", {
                            title: title,
                            description: description,
                            author: author,
                            keywords: keywords
                        });
                    } else {
                        let category = new Category({
                            title: title,
                            slug: slug,
                            description: description,
                            author: author,
                            keywords: keywords
                        });
                        category.save(function (err) {
                            if (err) { Logger.error(err) };
                            Category.find(function (err, categories) {
                                if (err) { Logger.error(err)
                                } else {
                                    req.app.locals.blogcategories = categories;
                                }
                            })
                            req.flash("success", "Page added!");
                            res.redirect("/admin/blog-categories");
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
* GET edit category
*/
router.get("/edit-blog-category/:id", isAdmin, function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) { Logger.error(err)
        } else {
            res.render("../../upgrade/blog/views/categories/edit_blog_category", {
                title: category.title,
                id: category._id,
                author: category.author,
                description: category.description,
                keywords: category.keywords
            })
        }
    })
})

/*
* POST edit category
*/
router.post("/edit-blog-category/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let id = req.params.id;

            let author = req.body.author;
            let description = req.body.description;
            let keywords = req.body.keywords;

            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../upgrade/blog/views/categories/edit_blog_category", {
                    errors: errors,
                    title: title,
                    id: id,
                    description: description,
                    author: author,
                    keywords: keywords
                })
            } else {

                Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, chooser another.")
                        return res.render("../../upgrade/blog/views/categories/edit_blog_category", {
                            title: title,
                            id: id,
                            description: description,
                            author: author,
                            keywords: keywords
                        });
                    } else {
                        Category.findById(id, function (err, category) {
                            if (err) { Logger.error(err) };
                            category.title = title;
                            category.slug = slug;
                            category.author = author;
                            category.description = description;
                            category.keywords = keywords;

                            category.save(function (err) {
                                if (err) { Logger.error(err) };
                                Category.find(function (err, categories) {
                                    if (err) { Logger.error(err)
                                    } else {
                                        req.app.locals.blogcategories = categories;
                                    }
                                })
                                req.flash("success", "Page added!");
                                res.redirect("/admin/blog-categories");
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
* GET delete page
*/
router.get("/delete-blog-category/:id", isAdmin, function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) { Logger.error(err) };

        Category.find(function (err, categories) {
            if (err) { Logger.error(err)
            } else {
                req.app.locals.blogcategories = categories;
            }
        })
        req.flash("success", "Category deleted!")
        res.redirect("/admin/blog-categories")

    })
})

//Exports
module.exports = router;