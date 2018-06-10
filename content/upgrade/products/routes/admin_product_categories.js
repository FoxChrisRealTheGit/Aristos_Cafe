const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET Product category model
const Category = require("../models/productCategory")
// GET media model
const Media = require("../../../../includes/models/media")
// GET user model
const User = require("../../../../includes/models/user")
/*
* GET product category index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Category.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
        if (count < 1) {
            Category.findOne({ title: "General" }, function (err, categories) {
                if (err) { Logger.error(err) };
                if (!categories) {
                    let category = new Category({
                        title: "General",
                        slug: "general",
                        author: "",
                        description: "",
                        keywords: "",
                        imagePath: ""
                    });
                    category.save(function (err) {
                        if (err) { Logger.error(err) };
                        Category.find(function (err, categories) {
                            if (err) { Logger.error(err)
                            } else {
                                req.app.locals.productcategories = categories;
                            }
                        })
                    })
                }
            })
        }
        Category.find(function (err, categories) {
            if (err) { Logger.error(err)
            } else {
                res.render("../../upgrade/products/views/categories/product_categories", {
                    categories: categories,
                    count: count
                })
            }
        })
    })
})
/*
* GET add product category
*/
router.get("/add-product-category", isAdmin, function (req, res) {
    let title = "";
    let author = "";
    let description = "";
    let keywords = "";
    let imagePath = "";
    Media.find({}, function (err, media) {
        if (err) { Logger.error(err) };
        res.render("../../upgrade/products/views/categories/add_product_category", {
            title: title,
            author: author,
            description: description,
            keywords: keywords,
            imagePath: imagePath,
            media: media
        })
    })
})

/*
* POST add product category
*/
router.post("/add-product-category", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let errors = req.validationErrors();
            let author = req.body.author;
            let description = req.body.description;
            let keywords = req.body.keywords;
            let imagePath = req.body.imagepath

            if (errors) {
                return res.render("../../upgrade/products/views/categories/add_product_category", {
                    errors: errors,
                    title: title,
                    author: author,
                    description: description,
                    keywords: keywords
                })
            } else {
                Category.findOne({ slug: slug }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, choose another.")
                        return res.render("../../upgrade/products/views/categories/add_product_category", {
                            title: title,
                            author: author,
                            description: description,
                            keywords: keywords
                        });
                    } else {
                        let category = new Category({
                            title: title,
                            slug: slug,
                            author: author,
                            description: description,
                            keywords: keywords,
                            imagepath: imagePath
                        });
                        category.save(function (err) {
                            if (err) { Logger.error(err) };
                            Category.find(function (err, categories) {
                                if (err) { Logger.error(err)
                                } else {
                                    req.app.locals.productcategories = categories;
                                }
                            })
                            req.flash("success", "Page added!");
                            res.redirect("/admin/product-categories");
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
* GET edit product category
*/
router.get("/edit-product-category/:id", isAdmin, function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) { Logger.error(err)
        } else {
            Media.find({}, function (err, media) {
                if (err) { Logger.error(err) };
                res.render("../../upgrade/products/views/categories/edit_product_category", {
                    title: category.title,
                    id: category._id,
                    author: category.author,
                    description: category.description,
                    keywords: category.keywords,
                    media: media,
                    imagepath: category.imagepath
                })
            })
        }
    })
})

/*
* POST edit product category
*/
router.post("/edit-product-category/:id", function (req, res) {
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
            let imagepath = req.body.imagepath;
            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../upgrade/products/views/categories/edit_product_category", {
                    errors: errors,
                    title: title,
                    id: id,
                    author: author,
                    description: description,
                    keywords: keywords
                })
            } else {

                Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
                    if (err) { Logger.error(err) };
                    if (category) {
                        req.flash("danger", "Category title exists, chooser another.")
                        return res.render("../../upgrade/products/views/categories/edit_product_category", {
                            title: title,
                            id: id,
                            author: author,
                            description: description,
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
                            category.imagepath = imagepath

                            category.save(function (err) {
                                if (err) { Logger.error(err) };
                                Category.find(function (err, categories) {
                                    if (err) { Logger.error(err)
                                    } else {
                                        req.app.locals.productcategories = categories;
                                    }
                                })
                                req.flash("success", "Page added!");
                                res.redirect("/admin/product-categories");
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
* GET delete product category
*/
router.get("/delete-product-category/:id", isAdmin, function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) { Logger.error(err) };

        Category.find(function (err, categories) {
            if (err) { Logger.error(err)
            } else {
                req.app.locals.productcategories = categories;
            }
        })
        req.flash("success", "Category deleted!")
        res.redirect("/admin/product-categories")

    })
})

//Exports
module.exports = router;