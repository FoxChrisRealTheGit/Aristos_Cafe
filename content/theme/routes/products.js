const express = require("express")
const router = express.Router();
const fs = require("fs-extra");
// GET Product model
const Product = require("../../upgrade/products/models/product")
// GET Product Category model
const Category = require("../../upgrade/products/models/productCategory")
// GET media model
const Media = require("../../../includes/models/media")
/*
* GET  all products
*/

router.get("/", function (req, res) {
    Media.find({}, function (err, media) {
        Product.find({}).sort({ sorting: 1 }).exec(function (err, products) {
            if (err) {
                console.log(err);
            }
            res.render("product/all_products", {
                title: "All products",
                products: products,
                description: "",
                author: "",
                keywords: "",
                media: media
            })

        })
    })
})

/*
* GET  products by category
*/

router.get("/:category", function (req, res) {

    let categorySlug = req.params.category;

    Media.find({}, function (err, media) {
        Category.findOne({ slug: categorySlug }, function (err, c) {
            if (c) {
                Product.find({ category: categorySlug }).sort({ sorting: 1 }).exec(function (err, products) {
                    if (err) {
                        console.log(err);
                    }
                    res.render("product/cat_products", {
                        title: c.title,
                        slug: c.slug,
                        products: products,
                        description: c.description,
                        author: c.author,
                        keywords: c.keywords,
                        media: media
                    })

                })
            } else {
                Product.find({}).sort({ sorting: 1 }).exec(function (err, products) {
                    if (err) {
                        console.log(err);
                    }
                    res.render("product/all_products", {
                        title: "All products",
                        products: products,
                        description: "",
                        author: "",
                        keywords: "",
                        media: media
                    })

                })

            }
        })
    })
})

/*
* GET  product details
*/

router.get("/:category/:product", function (req, res) {

    let galleryImages = null;
    let loggedIn = (req.isAuthenticated()) ? true : false
    Media.find({}, function (err, media) {
        Product.findOne({ slug: req.params.product }, function (err, product) {
            if (err) {
                console.log(err)
            } else {
                let galleryDir = "content/public/images/product_images/" + product._id + "/gallery";

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err)
                    } else {
                        galleryImages = files;

                        res.render("product/product", {
                            title: product.title,
                            product: product,
                            galleryImages: galleryImages,
                            loggedIn: loggedIn,
                            author: product.author,
                            description: product.description,
                            keywords: product.keywords,
                            media: media
                        })
                    }

                })
            }
        })

    })
})


//Exports
module.exports = router;