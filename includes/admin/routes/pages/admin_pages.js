const express = require("express")
const router = express.Router();
const auth = require("../../../config/auth")
const fs = require("fs-extra");
const Logger = require("../../../AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;
// GET page model
const Page = require("../../../models/page")

//GET media model
const Media = require("../../../models/media")

// GET user model
const User = require("../../../models/user")
/*
* GET pages index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Page.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
    })
    Page.findOne({ title: "Home" }, function (err, pages) {
        if (err) { Logger.error(err) };
        if (!pages) {
            let page = new Page({
                title: "Home",
                slug: "home",
                content: "You should put stuff here and stuff.",
                parent: "home",
                description: "",
                keywords: "",
                author: ""
            });
            page.save(function (err) {
                if (err) { Logger.error(err) };
                Page.find(function (err, pages) {
                    if (err) { Logger.error(err)
                    } else {
                        req.app.locals.pages = pages;
                    }
                })
            })
        }
    })
    Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
        if (err) { Logger.error(err) };
        res.render("../../../includes/admin/views/pages/pages", {
            pages: pages
        })
    })
})

/*
* GET add page
*/
router.get("/add-page", isAdmin, function (req, res) {
    let title = "";
    let slug = "";
    let content = "";
    let parent = "";
    let description = "";
    let keywords = "";
    let author = "";
    Media.find({}, function (err, media) {
        if (err) { Logger.error(err) };
        res.render("../../../includes/admin/views/pages/add_page", {
            title: title,
            slug: slug,
            content: content,
            parent: parent,
            media: media,
            description: description,
            keywords: keywords,
            author: author
        })
    })
})

/*
* POST add page
*/
router.post("/add-page", function (req, res) {
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
            let parent = req.body.parent;
            let description = req.body.description;
            let keywords = req.body.keywords;
            let author = req.body.author;
            if (parent == "") {
                parent = "home"
            }
            let errors = req.validationErrors();

            if (errors) {
                return res.render("../../../includes/admin/views/pages/add_page", {
                    errors: errors,
                    title: title,
                    slug: slug,
                    parent: parent,
                    content: content,
                    description: description,
                    keywords: keywords,
                    author: author
                })
            } else {
                Page.findOne({ slug: slug }, function (err, page) {
                    if (err) { Logger.error(err) };
                    if (page) {
                        req.flash("danger", "Page slug exists, chooser another.")
                        return res.render("../../../includes/admin/views/pages/add_page", {
                            title: title,
                            slug: slug,
                            content: content,
                            parent: parent,
                            description: description,
                            keywords: keywords,
                            author: author
                        });
                    } else {
                        let page = new Page({
                            title: title,
                            slug: slug,
                            content: content,
                            parent: parent,
                            sorting: 100,
                            description: description,
                            keywords: keywords,
                            author: author
                        });
                        page.save(function (err) {
                            if (err) { Logger.error(err) };
                            Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
                                if (err) { Logger.error(err)
                                } else {
                                    req.app.locals.pages = pages;
                                }
                            })

                            req.flash("success", "Page added!");
                            res.redirect("/admin/pages");
                        })
                    }
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})

// Sort pages function
function sortPages(ids, cb) {
    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                if (err) { Logger.error(err) };
                page.sorting = count;
                page.save(function (err) {
                    if (err) { Logger.error(err) };

                    ++count;
                    if (count >= ids.length) {
                        cb()

                    }
                });
            });
        })(count);
    }
}

/* 
* POST reorder pages
*/
router.post("/reorder-pages", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let ids = req.body["id[]"]

            sortPages(ids, function () {
                Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
                    if (err) { Logger.error(err)
                    } else {
                        req.app.locals.pages = pages;
                    }
                })
            })
        } else {
            res.redirect("/users/login");
        }
    })
})


/*
* GET edit page
*/
router.get("/edit-page/:id", isAdmin, function (req, res) {
    Page.findById(req.params.id, function (err, page) {
        if (err) { Logger.error(err)
        } else {
            Media.find({}, function (err, media) {
                if (err) { Logger.error(err) };
                res.render("../../../includes/admin/views/pages/edit_page", {
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    parent: page.parent,
                    id: page._id,
                    media: media,
                    description: page.description,
                    keywords: page.keywords,
                    author: page.author,
                    selectedCat: page.parent
                })
            })
        }
    })
})

/*
* POST edit page
*/
router.post("/edit-page/:id", function (req, res) {
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
            let parent = req.body.parent
            if (parent == "") {
                parent = "home"
            }
            let content = req.body.content;
            let keywords = req.body.keywords;
            let author = req.body.author;
            let description = req.body.description;
            let id = req.params.id;

            let errors = req.validationErrors();

            if (errors) {
                Media.find({}, function (err, media) {
                    if (err) { Logger.error(err) };
                    return res.render("../../../includes/admin/views/pages/edit_page", {
                        errors: errors,
                        title: title,
                        slug: slug,
                        content: content,
                        parent: parent,
                        media: media,
                        keywords: keywords,
                        description: description,
                        author: author,
                        id: id
                    })
                })
            } else {
                Page.findOne({ slug: slug, _id: { '$ne': id } }, function (err, page) {
                    if (err) { Logger.error(err) };
                    if (page) {
                        Media.find({}, function (err, media) {
                            if (err) { Logger.error(err) };
                            req.flash("danger", "Page slug exists, chooser another.")
                            return res.render("../../../includes/admin/views/pages/edit_page", {
                                title: title,
                                slug: slug,
                                content: content,
                                parent: parent,
                                id: id,
                                media: media,
                                keywords: keywords,
                                author: author,
                                description: description
                            })
                        });
                    } else {
                        Page.findById(id, function (err, page) {
                            if (err) { Logger.error(err)
                            } else {
                                page.title = title;
                                page.slug = slug;
                                page.content = content;
                                page.parent = parent;
                                page.description = description;
                                page.keywords = keywords;
                                page.author = author;

                                page.save(function (err) {
                                    if (err) { Logger.error(err) };

                                    Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
                                        if (err) { Logger.error(err)
                                        } else {
                                            req.app.locals.pages = pages;
                                        }
                                    })

                                    req.flash("success", "Page edited!");
                                    res.redirect("/admin/pages");
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
* GET delete page
*/
router.get("/delete-page/:id", isAdmin, function (req, res) {
    Page.findByIdAndRemove(req.params.id, function (err) {
        if (err) { Logger.error(err)
        } else {

            Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
                if (err) { Logger.error(err)
                } else {
                    req.app.locals.pages = pages;
                }
            })

            req.flash("success", "Page deleted!")
            res.redirect("/admin/pages/")
        }
    })
})


/*
* GET add dynamic page
*/
router.get("/add-dynamic-builder", isAdmin, function (req, res) {
    let title = "";
    let slug = "";
    let content = "";
    let parent = "";
    let description = "";
    let keywords = "";
    let author = "";
    Media.find({}, function (err, media) {
        res.render("../../../includes/admin/views/pages/add_dynamic_builder", {
            title: title,
            slug: slug,
            content: content,
            parent: parent,
            media: media,
            description: description,
            keywords: keywords,
            author: author
        })
    })
})
/*
* GET edit dynamic page
*/
router.get("/edit-dynamic-builder/:id", isAdmin, function (req, res) {
    Page.findById(req.params.id, function (err, page) {
        if (err) { Logger.error(err)
        } else {
            Media.find({}, function (err, media) {
                res.render("../../../includes/admin/views/pages/edit_dynamic_builder", {
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    parent: page.parent,
                    id: page._id,
                    media: media,
                    description: page.description,
                    keywords: page.keywords,
                    author: page.author
                })
            })
        }
    })
})


//Exports
module.exports = router;