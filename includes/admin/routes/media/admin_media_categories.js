const express = require("express")
const router = express.Router();
const auth = require("../../../config/auth")
const fs = require("fs-extra");
const Logger = require("../../../AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET Media category model
const Category = require("../../../models/mediaCategory")

// GET user model
const User = require("../../../models/user")

/*
* GET media category index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Category.count(function (err, c) {
        if (err) { Logger.error(err) }
        count = c;
    })
    Category.findOne({ title: "General" }, function (err, categories) {
        if (err) { Logger.error(err) }
        if (!categories) {
            let category = new Category({
                title: "General",
                slug: "general"
            });
            category.save(function (err) {
                if (err) { Logger.error(err) };
                Category.find(function (err, categories) {
                    if (err) {
                        Logger.error(err)
                    } else {
                        req.app.locals.mediacategories = categories;
                    }
                })
            })
        }
    })
    Category.find(function (err, categories) {
        if (err) {
            Logger.error(err)
        } else {
            res.render("../../../includes/admin/views/media/categories/media_categories", {
                categories: categories,
                count: count
            })
        }
    })
})

/*
* GET add media category
*/
router.get("/add-media-category", isAdmin, function (req, res) {
    let title = "";

    res.render("../../../includes/admin/views/media/categories/add_media_category", {
        title: title
    })
})

/*
* POST add category
*/
router.post("/add-media-category", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../../includes/admin/views/media/categories/add_media_category", {
                    errors: errors,
                    title: title
                })
            } else {
                Category.findOne({ slug: slug }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, choose another.")
                        return res.render("../../../includes/admin/views/media/categories/add_media_category", {
                            title: title
                        });
                    } else {

                        let category = new Category({
                            title: title,
                            slug: slug
                        });
                        category.save(function (err) {
                            if (err) { Logger.error(err) };
                            fs.ensureDir("content/public/images/" + category.title, function (err) {
                                if (err) { Logger.error(err) };
                            })
                            Category.find(function (err, categories) {
                                if (err) {
                                    Logger.error(err)
                                } else {
                                    req.app.locals.mediacategories = categories;
                                }
                            })
                            req.flash("success", "Page added!");
                            res.redirect("/admin/media-categories");
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
* GET edit media category
*/
router.get("/edit-media-category/:id", isAdmin, function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            Logger.error(err)
        } else {
            res.render("../../../includes/admin/views/media/categories/edit_media_category", {
                title: category.title,
                id: category._id
            })
        }
    })
})

/*
* POST edit media category
*/
router.post("/edit-media-category/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let id = req.params.id;

            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../../includes/admin/views/media/categories/edit_media_category", {
                    errors: errors,
                    title: title,
                    id: id
                })
            } else {
                Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, chooser another.")
                        return res.render("../../../includes/admin/views/media/categories/edit_media_category", {
                            title: title,
                            id: id
                        });
                    } else {
                        Category.findById(id, function (err, category) {
                            if (err) { Logger.error(err) };
                            category.title = title;
                            category.slug = slug;

                            category.save(function (err) {
                                if (err) { Logger.error(err) };
                                Category.find(function (err, categories) {
                                    if (err) {
                                        Logger.error(err)
                                    } else {
                                        req.app.locals.mediacategories = categories;
                                    }
                                })
                                req.flash("success", "Page added!");
                                res.redirect("/admin/media-categories");
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
* GET delete media category
*/
// needs to also remove the folder in the public
router.get("/delete-media-category/:id", isAdmin, function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) { Logger.error(err) };

        Category.find(function (err, categories) {
            if (err) {
                Logger.error(err)
            } else {
                req.app.locals.mediacategories = categories;
            }
        })
        req.flash("success", "Category deleted!")
    })
})

//Exports
module.exports = router;