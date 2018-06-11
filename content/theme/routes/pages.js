const express = require("express")
const router = express.Router();
const Logger = require("../../../includes/AristosLogger/AristosLogger").Logger;
// GET page model
const Page = require("../../../includes/models/page")
// GET media model
const Media = require("../../../includes/models/media")
// GET Product model
const Product = require("../../upgrade/products/models/product")
/*
* GET mission statement
*/

router.get("/directions", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "directions" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("about_us", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})
/*
* GET mission statement
*/

router.get("/about/mission-statement", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "mission-statement" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("about_us", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})
/*
* GET about page
*/

router.get("/how-we-roast", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "how-we-roast" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("how_we_roast", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})

/*
* GET drink menu
*/

router.get("/drink-menu", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "drink-menu" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("drink_menu", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})
/*
* GET food menu
*/

router.get("/food-menu", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "food-menu" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("food_menu", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})
/*
* GET about page
*/

router.get("/about", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "about" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("about_us", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})

/*
* GET contact page
*/
router.get("/contact", function (req, res) {
    Media.find({}, function (err, media) {
        Page.findOne({ slug: "contact" }, function (err, page) {
            if (err) { Logger.error(err) };

            if (!page) {
                res.redirect("/")
            } else {
                res.render("contact", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})


/*
* GET /
*/

router.get("/", function (req, res) {
    Page.findOne({ slug: "home" }, function (err, pages) {
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
                    if (err) {
                        Logger.error(err)
                    } else {
                        req.app.locals.pages = pages;
                    }
                })
            })
        }
        Media.find({}, function (err, media) {
            if (err) { Logger.error(err) };
            Product.find({ category: "coffees" }).limit(2).exec(function (err, product) {
                if (err) { Logger.error(err) };
                res.render("index", {
                    title: pages.title,
                    content: pages.content,
                    keywords: pages.keywords,
                    description: pages.description,
                    author: pages.author,
                    media: media,
                    products: product
                })
            })
        })
    })
})

/*
* GET a page
*/

router.get("/:slug", function (req, res) {
    let slug = req.params.slug;
    Media.find({}, function (err, media) {
        Page.findOne({ slug: slug }, function (err, page) {
            if (err) {
                console.log(err);
            }

            if (!page) {
                res.redirect("/")
            } else {
                res.render("index", {
                    title: page.title,
                    content: page.content,
                    keywords: page.keywords,
                    description: page.description,
                    author: page.author,
                    media: media
                })
            }
        })
    })
})


//Exports
module.exports = router;