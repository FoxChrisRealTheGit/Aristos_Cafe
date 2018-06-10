const express = require("express")
const router = express.Router();
const fs = require("fs-extra");
const resizeImg = require("resize-img");
const auth = require("../../../config/auth")
const Logger = require("../../../AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET blog model
const Media = require("../../../models/media")

// GET Media Category model
const MediaCategory = require("../../../models/mediaCategory")

// GET user model
const User = require("../../../models/user")


/*
* GET add media index
*/
router.get("/", isAdmin, function (req, res) {

    MediaCategory.find(function (err, categories) {
        if (err) { Logger.error(err) }
        Media.find(function (err, media) {
            if (err) { Logger.error(err) }
            res.render("../../../includes/admin/views/media/media", {
                content: "",
                categories: categories,
                media: media
            })
        })
    })
})

/*
* POST add media
*/
router.post("/", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) }
        if (user.admin === 1) {
            let newMedia = req.files.file;
            let path = "General/" + req.files.file.name;
            fs.ensureDir("content/public/images/General", function (err) {
                if (err) { Logger.error(err) }
            })
            newMedia.mv("content/public/images/" + path, function (err) {
                if (err) { Logger.error(err) }
            })
            let media = new Media({
                title: "a new image",
                alt: "a new image",
                category: "General",
                path: path
            });
            media.save(function (err) {
                if (err) { Logger.error(err) }
            })
            res.sendStatus(200);
        } else {
            res.redirect("/users/login");
        }
    })
})


/*
* GET upload Image
*/
router.get("/upload-image", isAdmin, function (req, res) {
    let title = "";
    let alt = "";
    let link = "";
    let description = "";
    let keywords = "";
    MediaCategory.find(function (err, categories) {
        if (err) { Logger.error(err) }
        res.render("../../../includes/admin/views/media/add_image", {
            title: title,
            alt: alt,
            categories: categories,
            link: link,
            description: description,
            keywords: keywords
        })
    })
})

/*
* POST upload image
*/
router.post("/upload-image", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) }
        if (user.admin === 1) {
            let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("alt", "Alt Tag must have a value.").notEmpty();
            req.checkBody("image", "You must upload an image.").isImage(imageFile);

            let title = req.body.title;
            let alt = req.body.alt;
            let category = req.body.category
            let path = category + "/" + imageFile
            let description = req.body.description;
            let keywords = req.body.keywords;
            let link = req.body.link;

            let errors = req.validationErrors();

            if (errors) {
                MediaCategory.find(function (err, categories) {
                    if (err) { Logger.error(err) }
                    res.render("../../../includes/admin/views/media/add_image", {
                        errors: errors,
                        title: title,
                        alt: alt,
                        categories: categories,
                        link: link,
                        description: description,
                        keywords: keywords

                    })
                })
            } else {
                fs.ensureDir("content/public/images/" + category, function (err) {
                    if (err) { Logger.error(err) }
                })
                // mkdirp("content/public/images/" + category + "/" + title, function (err) {
                //     if (err) { console.log(err) }
                // })
                if (imageFile !== "") {
                    let newMedia = req.files.image;
                    newMedia.mv("content/public/images/" + path, function (err) {
                        if (err) { Logger.error(err) }
                    })
                }
                let media = new Media({
                    title: title,
                    alt: alt,
                    category: category,
                    path: path,
                    link: link,
                    description: description,
                    keywords: keywords
                });
                media.save(function (err) {
                    if (err) { Logger.error(err) }



                    req.flash("success", "Media added!");
                    res.redirect("/admin/add-media");
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* GET edit image
*/
router.get("/edit-image/:id", isAdmin, function (req, res) {
    MediaCategory.find(function (err, categories) {
        if (err) { Logger.error(err) }
        Media.findById(req.params.id, function (err, media) {
            if (err) { Logger.error(err) }
            res.render("../../../includes/admin/views/media/edit_image", {
                content: "",
                title: media.title,
                alt: media.alt,
                categories: categories,
                path: media.path,
                id: media._id,
                link: media.link,
                description: media.description,
                keywords: media.keywords,
                selectedCat: media.category
            })
        })
    })
})

/*
* POST edit image
*/
router.post("/edit-image/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) }
        if (user.admin === 1) {
            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("alt", "Alt Tag must have a value.").notEmpty();

            let title = req.body.title;
            let alt = req.body.alt;
            let category = req.body.category;
            let id = req.params.id;
            let errors = req.validationErrors();
            let description = req.body.description;
            let keywords = req.body.keywords;
            let link = req.body.link;

            if (errors) {
                req.session.error = errors;
                res.redirect("/admin/views/media/edit-media/" + id);
            } else {
                // need to move file if title is changed

                // mkdirp("content/public/images/" + category, function (err) {
                //     if (err) { console.log(err) }
                // })
                // mkdirp("content/public/images/" + category + "/" + title, function (err) {
                //     if (err) { console.log(err) }
                // })
                // if (imageFile !== "") {
                //     let newMedia = req.files.image;
                //     newMedia.mv("content/public/images/" + path, function (err) {
                //         if (err) { console.log(err) }
                //     })
                // }
                Media.findById(id, function (err, media) {
                    if (err) { Logger.error(err) }
                    media.title = title;
                    media.alt = alt;
                    media.category = category;
                    media.link = link;
                    media.description = description;
                    media.keywords = keywords;

                    media.save(function (err) {
                        if (err) { Logger.error(err) }

                        req.flash("success", "Media updated!");
                        res.redirect("/admin/add-media");
                    })
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* GET delete image
*/
router.get("/delete-image/:id", isAdmin, function (req, res) {
    let id = req.params.id

    Media.findById(id, function (err, media) {
        if (err) { Logger.error(err) }
        let path = "content/public/images/" + media.path
        fs.remove(path, function (err) {
            if (err) { Logger.error(err)
            } else {
                Media.findByIdAndRemove(id, function (err, media) {
                    if (err) { Logger.error(err) }

                })
                req.flash("success", "Image deleted!")
                res.redirect("/admin/add-media")
            }
        })
    })

})
/*
* GET delete image
*/
router.get("/trash-delete-image/:id", isAdmin, function (req, res) {
    let id = req.params.id

    Media.findById(id, function (err, media) {
        if (err) { Logger.error(err) }
        let path = "content/public/images/" + media.path
        fs.remove(path, function (err) {
            if (err) { Logger.error(err)
            } else {
                Media.findByIdAndRemove(id, function (err, media) {
                    if (err) { Logger.error(err) }

                })
                req.flash("success", "Image deleted!")
                res.redirect("/admin/add-media")
            }
        })
    })

})
/*
* GET upload video
*/
router.get("/upload-video", isAdmin, function (req, res) {
    let title = "";
    let alt = ""
    MediaCategory.find(function (err, categories) {
        if (err) { Logger.error(err) }
        res.render("../../../includes/admin/views/media/add_image", {
            title: title,
            alt: alt,
            categories: categories
        })
    })
})

/*
* POST upload video
*/
router.post("/upload-video/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) }
        if (user.admin === 1) {

        } else {
            res.redirect("/users/login");
        }
    })
})


/*
* GET edit video
*/
router.get("/edit-video/:id", isAdmin, function (req, res) {
    res.render("../../../includes/admin/views/media/edit_video", {
        content: ""
    })
})

/*
* GET delete video
*/
router.get("/delete-video/:video", isAdmin, function (req, res) {
    let originalImage = "public/product_images/" + req.query.id + "/gallery/" + req.params.image;
    let thumbsImage = "public/product_images/" + req.query.id + "/gallery/thumbs/" + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) { Logger.error(err)
        } else {
            fs.remove(thumbsImage, function (err) {
                if (err) { Logger.error(err)
                } else {
                    req.flash("success", "Image deleted!");
                    res.redirect("/admin/products/edit-products/" + req.query.id)
                }
            })
        }
    })

})

//Exports
module.exports = router;