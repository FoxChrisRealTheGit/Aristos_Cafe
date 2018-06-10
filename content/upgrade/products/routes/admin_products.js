const express = require("express")
const router = express.Router();
const fs = require("fs-extra");
const resizeImg = require("resize-img");
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET Product model
const Product = require("../models/product")
//GET media model
const Media = require("../../../../includes/models/media")
// GET media categories
const MediaCategory = require("../../../../includes/models/mediaCategory")
// GET Product Category model
const Category = require("../models/productCategory")
// GET User model
const User = require("../../../../includes/models/user")

/*
* GET Product index
*/
router.get("/", isAdmin, function (req, res) {
    let count;

    Product.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
    })

    Product.find({}).sort({ sorting: 1 }).exec(function (err, products) {
        if (err) { Logger.error(err) };
        Category.find(function (err, categories) {
            if (err) { Logger.error(err) };
            res.render("../../upgrade/products/views/products", {
                products: products,
                categories: categories,
                count: count
            })
        })
    })
})
/*
* GET Product index
*/
router.get("/categories/:category", isAdmin, function (req, res) {
    let count;

    Product.count(function (err, c) {
        if (err) { Logger.error(err) };
        count = c;
    })

    Product.find({ category: req.params.category }).sort({ sorting: 1 }).exec(function (err, products) {
        if (err) { Logger.error(err) };
        Category.find(function (err, categories) {
            if (err) { Logger.error(err) };
            res.render("../../upgrade/products/views/products", {
                products: products,
                categories: categories,
                count: count
            })
        })
    })
})

/*
* GET add Product
*/
router.get("/add-product", isAdmin, function (req, res) {
    let title = "";
    let content = "";
    let price = "";
    let keywords = "";
    let description = "";
    let author = ""

    if (req.app.locals.printfulPluginExists) {
        let printfile = ""

        Category.find(function (err, categories) {
            if (err) { Logger.error(err) };
            Media.find({}, function (err, media) {
                if (err) { Logger.error(err) };

                res.render("../../upgrade/products/views/add_product", {
                    title: title,
                    content: content,
                    categories: categories,
                    price: price,
                    media: media,
                    description: description,
                    keywords: keywords,
                    author: author,
                    printfile: printfile
                })
            })
        })
    } else {

        Category.find(function (err, categories) {
            if (err) { Logger.error(err) };
            Media.find({}, function (err, media) {
                if (err) { Logger.error(err) };
                res.render("../../upgrade/products/views/add_product", {
                    title: title,
                    content: content,
                    categories: categories,
                    price: price,
                    media: media,
                    description: description,
                    keywords: keywords,
                    author: author
                })
            })
        })
    }
})

/*
* POST add Product
*/
router.post("/add-product", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();
            req.checkBody("price", "Price must have a value.").isDecimal();
            req.checkBody("image", "You must upload an image.").isImage(imageFile);

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let content = req.body.content;
            let price = req.body.price;
            let category = req.body.category;
            let keywords = req.body.keywords;
            let description = req.body.description;
            let author = req.body.author;

            let errors = req.validationErrors();

            if (req.app.locals.printfulPluginExists) {
                let sizes = req.body.sizes;
                let color = req.body.color;
                let printfile = req.body.printfile;
                let productType = req.body.productType
                if (errors) {
                    Category.find(function (err, categories) {
                        if (err) { Logger.error(err) };
                        Media.find({}, function (err, media) {
                            if (err) { Logger.error(err) };
                            res.render("../../upgrade/products/views/add_product", {
                                errors: errors,
                                title: title,
                                content: content,
                                categories: categories,
                                price: price,
                                media: media,
                                description: description,
                                keywords: keywords,
                                author: author,
                                printfile: printfile
                            })
                        })
                    })
                } else {
                    Product.findOne({ slug: slug }, function (err, product) {
                        if (err) { Logger.error(err) };
                        if (product) {
                            req.flash("danger", "Product title exists, chooser another.")
                            Media.find({}, function (err, media) {
                                if (err) { Logger.error(err) };
                                Category.find(function (err, categories) {
                                    if (err) { Logger.error(err) };
                                    res.render("../../upgrade/products/views/add_product", {
                                        title: title,
                                        content: content,
                                        categories: categories,
                                        price: price,
                                        media: media,
                                        description: description,
                                        keywords: keywords,
                                        author: author,
                                        printfile: printfile
                                    })
                                })
                            })
                        } else {
                            let price2 = parseFloat(price).toFixed(2);
                            let product = new Product({
                                title: title,
                                slug: slug,
                                content: content,
                                price: price2,
                                category: category,
                                image: imageFile,
                                description: description,
                                keywords: keywords,
                                sorting: 100,
                                author: author,
                                printfile: printfile,
                                productType: productType,
                                color: color,
                                sizes: sizes
                            });

                            product.save(function (err) {
                                if (err) { Logger.error(err) };

                                fs.ensureDirSync("content/public/images/product_images/" + product._id, function (err) {
                                     if (err) { Logger.error(err) };
                                })
                                fs.ensureDirSync("content/public/images/product_images/" + product._id + "/gallery", function (err) {
                                    if (err) { Logger.error(err) };
                                })
                                fs.ensureDirSync("content/public/images/product_images/" + product._id + "/gallery/thumbs", function (err) {
                                    if (err) { Logger.error(err) };
                                })



                                if (imageFile !== "") {
                                    let productImage = req.files.image;
                                    let path = "content/public/images/product_images/" + product._id + "/" + imageFile;

                                    productImage.mv(path, function (err) {
                                        if (err) { Logger.error(err) };
                                    })
                                }
                            })

                        }
                        req.flash("success", "Product added!");
                        res.redirect("/admin/products");
                    })
                }
            } else {

                if (errors) {
                    Category.find(function (err, categories) {
                        if (err) { Logger.error(err) };
                        Media.find({}, function (err, media) {
                            if (err) { Logger.error(err) };
                            res.render("../../upgrade/products/views/add_product", {
                                errors: errors,
                                title: title,
                                content: content,
                                categories: categories,
                                price: price,
                                media: media,
                                description: description,
                                keywords: keywords,
                                author: author
                            })
                        })
                    })
                } else {
                    Product.findOne({ slug: slug }, function (err, product) {
                        if (err) { Logger.error(err) };
                        if (product) {
                            req.flash("danger", "Product title exists, chooser another.")
                            Media.find({}, function (err, media) {
                                if (err) { Logger.error(err) };
                                Category.find(function (err, categories) {
                                    if (err) { Logger.error(err) };
                                    res.render("../../upgrade/products/views/add_product", {
                                        title: title,
                                        content: content,
                                        categories: categories,
                                        price: price,
                                        media: media,
                                        description: description,
                                        keywords: keywords,
                                        author: author
                                    })
                                })
                            })
                        } else {
                            let price2 = parseFloat(price).toFixed(2);
                            let product = new Product({
                                title: title,
                                slug: slug,
                                content: content,
                                price: price2,
                                category: category,
                                image: imageFile,
                                description: description,
                                keywords: keywords,
                                sorting: 100,
                                author: author
                            });

                            product.save(function (err) {
                                if (err) { Logger.error(err) };

                                fs.ensureDirSync("content/public/images/product_images/" + product._id, function (err) {
                                    if (err) { Logger.error(err) };
                                })
                                fs.ensureDirSync("content/public/images/product_images/" + product._id + "/gallery", function (err) {
                                    if (err) { Logger.error(err) };
                                })
                                fs.ensureDirSync("content/public/images/product_images/" + product._id + "/gallery/thumbs", function (err) {
                                    if (err) { Logger.error(err) };
                                })



                                if (imageFile !== "") {
                                    let productImage = req.files.image;
                                    let path = "content/public/images/product_images/" + product._id + "/" + imageFile;

                                    productImage.mv(path, function (err) {
                                        if (err) { Logger.error(err) };
                                    })
                                }
                            })
                        }
                        req.flash("success", "Product added!");
                        res.redirect("/admin/products");
                    })
                }
            }
        } else {
            res.redirect("/users/login");
        }
    })
})
/*
* GET edit Product
*/
router.get("/edit-product/:id", isAdmin, function (req, res) {
    let errors;

    if (req.session.errors) {
        errors = req.session.errors;
    } else {
        req.session.errors = null;
    }
    Category.find(function (err, categories) {
        Product.findById(req.params.id, function (err, p) {
            if (err) { Logger.error(err)
                res.redirect("/admin/products")
            } else {
                let galleryDir = "content/public/images/product_images/" + p._id + "/gallery"
                let galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) { Logger.error(err)
                    } else {
                        galleryImages = files

                        if (req.app.locals.printfulPluginExists) {

                            Media.find({}, function (err, media) {
                                res.render("../../upgrade/products/views/edit_product", {
                                    title: p.title,
                                    errors: errors,
                                    content: p.content,
                                    categories: categories,
                                    selectedCat: p.category,
                                    price: parseFloat(p.price).toFixed(2),
                                    image: p.image,
                                    galleryImages: galleryImages,
                                    id: p._id,
                                    media: media,
                                    author: p.author,
                                    description: p.description,
                                    keywords: p.keywords,
                                    sizes: p.sizes,
                                    color: p.color,
                                    printfile: p.printfile,
                                })
                            })

                        } else {
                            Media.find({}, function (err, media) {
                                if (err) { Logger.error(err) };
                                res.render("../../upgrade/products/views/edit_product", {
                                    title: p.title,
                                    errors: errors,
                                    content: p.content,
                                    categories: categories,
                                    selectedCat: p.category,
                                    price: parseFloat(p.price).toFixed(2),
                                    image: p.image,
                                    galleryImages: galleryImages,
                                    id: p._id,
                                    media: media,
                                    author: p.author,
                                    description: p.description,
                                    keywords: p.keywords
                                })
                            })
                        }
                    }
                })
            }
        })
    })
})

/*
* POST edit Product
*/
router.post("/edit-product/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

            req.checkBody("title", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();
            req.checkBody("price", "Price must have a value.").isDecimal();
            req.checkBody("image", "You must upload an image.").isImage(imageFile);

            let title = req.body.title;
            let slug = title.replace(/\s+/g, "-").toLowerCase();
            let content = req.body.content;
            let price = req.body.price;
            let category = req.body.category;
            let pimage = req.body.pimage;
            let id = req.params.id;
            let description = req.body.description;
            let author = req.body.author;
            let keywords = req.body.keywords;

            let errors = req.validationErrors();

            if (errors) {
                req.session.error = errors;
                res.redirect("/admin/products/products/edit-products/" + id);
            } else {
                Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, p) {
                    if (err) { Logger.error(err) };

                    if (p) {
                        req.flash("danger", "Product title exists, choose another.")
                        res.redirect("/admin/products/edit-product" + id)
                    } else {
                        Product.findById(id, function (err, p) {
                            if (err) { Logger.error(err) };

                            p.title = title;
                            p.slug = slug;
                            p.content = content;
                            p.price = parseFloat(price).toFixed(2);
                            p.category = category;
                            if (imageFile !== "") {
                                p.image = imageFile
                            }
                            p.description = description;
                            p.keywords = keywords;
                            p.author = author;

                            p.save(function (err) {
                                if (err) { Logger.error(err) };

                                if (imageFile !== "") {
                                    if (pimage !== "") {
                                        fs.remove("content/public/images/product_images/" + id + "/" + pimage, function (err) {
                                            if (err) { Logger.error(err) };
                                        })
                                    }

                                    let productImage = req.files.image;
                                    let path = "content/public/images/product_images/" + id + "/" + imageFile;

                                    productImage.mv(path, function (err) {
                                        if (err) { Logger.error(err) };
                                    })
                                }

                                req.flash("success", "Product added!");
                                res.redirect("/admin/products");
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
* POST product gallery
*/
router.post("/product-gallery/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let productImage = req.files.file;
            let id = req.params.id;
            let path = "content/public/images/product_images/" + id + "/gallery/" + req.files.file.name;
            let thumbsPath = "content/public/images/product_images/" + id + "/gallery/thumbs/" + req.files.file.name;

            productImage.mv(path, function (err) {
                if (err) { Logger.error(err) };

                resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
                    fs.writeFileSync(thumbsPath, buf);
                })
            })
            res.sendStatus(200);
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* GET delete image
*/
router.get("/delete-image/:image", isAdmin, function (req, res) {
    let originalImage = "content/public/images/product_images/" + req.query.id + "/gallery/" + req.params.image;
    let thumbsImage = "content/public/images/product_images/" + req.query.id + "/gallery/thumbs/" + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) { Logger.error(err)
        } else {
            fs.remove(thumbsImage, function (err) {
                if (err) { Logger.error(err)
                } else {
                    req.flash("success", "Image deleted!");
                    res.redirect("/admin/products/edit-product/" + req.query.id)
                }
            })
        }
    })
})

/*
* GET delete Product
*/
router.get("/delete-product/:id", isAdmin, function (req, res) {

    let id = req.params.id;
    let path = "content/public/images/product_images/" + id;

    fs.remove(path, function (err) {
        if (err) { Logger.error(err)
        } else {
            Product.findByIdAndRemove(id, function (err) {
                if (err) { Logger.error(err) };
            })

            req.flash("success", "Product deleted!")
            res.redirect("/admin/products")
        }
    })
})
// Sort product function
function sortProducts(ids, cb) {
    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;

        (function (count) {
            Product.findById(id, function (err, product) {
                if (err) { Logger.error(err) };
                product.sorting = count;
                product.save(function (err) {
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
* POST reorder products
*/
router.post("/reorder-products",  function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            let ids = req.body["id[]"]

            sortProducts(ids, function () {
                Product.find({}).sort({ sorting: 1 }).exec(function (err, product) {
                    if (err) { Logger.error(err) };
                })
            })
        } else {
            res.redirect("/users/login");
        }
    })
})

//Exports
module.exports = router;