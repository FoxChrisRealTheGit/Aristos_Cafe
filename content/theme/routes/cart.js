const express = require("express")
const request = require('request');
const rp = require('request-promise-native');
const router = express.Router();

// GET product model
const Product = require("../../upgrade/products/models/product")
const config = require("../../../includes/config/stuff")

// GET page model
const Page = require("../../../includes/models/page")

//GET media model
const Media = require("../../../includes/models/media")

//GET orders model
const Order = require("../../upgrade/products/models/orders")
/*
* GET  add product to cart
*/
router.get("/add/:product", function (req, res) {
    let slug = req.params.product

    Product.findOne({ slug: slug }, function (err, p) {
        if (err) {
            console.log(err);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: "/product_images/" + p._id + "/" + p.image,
                description: "",
                author: "",
                keywords: ""
            })
        } else {
            let cart = req.session.cart;
            let newItem = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: "/product_images/" + p._id + "/" + p.image,
                    description: "",
                    author: "",
                    keywords: ""
                })
            }
        }

        req.flash("success", "Product added!");
        res.redirect("/cart/checkout")
    })
})
/*
* POST  add product to cart
*/
router.post("/add/:product", async function (req, res) {
    let slug = req.params.product

    Product.findOne({ slug: slug }, function (err, p) {
        if (err) {
            console.log(err);
        }
        let variant = variants(p.productType, req.body.color, req.body.size)

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: "/product_images/" + p._id + "/" + p.image,
                description: "",
                author: "",
                keywords: "",
                fileId: p.printfile,
                variant: variant
            })
        } else {
            let cart = req.session.cart;
            let newItem = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: "/product_images/" + p._id + "/" + p.image,
                    description: "",
                    author: "",
                    keywords: "",
                    fileId: p.printfile,
                    variant: variant
                })
            }
        }

        req.flash("success", "Product added!");
        res.redirect("/cart/checkout")
    })
})



/*
* GET  checkout product
*/
router.get("/checkout", function (req, res) {
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart
        delete req.session.shipping
        res.redirect("/cart/checkout");
    } else {
        let total = 0
        if (req.session.cart) {
            req.session.cart.forEach(function (product) {
                let sub = parseFloat(product.qty * product.price).toFixed(2)
                total += +sub
            })
        }
        let orderid = ""
        if (req.query.orderid) {
            orderid = req.query.orderid
        }
        let shipping = req.session.shipping !== undefined ? req.session.shipping : 0;
        total += +shipping;
        res.render("cart/checkout", {
            title: "checkout",
            shipping: parseFloat(shipping).toFixed(2),
            total: parseFloat(total).toFixed(2),
            cart: req.session.cart,
            description: "",
            author: "",
            keywords: "",
            orderid: orderid
        })
    }

})


/*
* GET  update product
*/
router.get("/update/:product", function (req, res) {
    let slug = req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;
    for (let i = 0; i < cart.length; i++) {
        switch (action) {
            case "add":
                cart[i].qty++;
                delete req.session.shipping
                break;
            case "remove":
                cart[i].qty--;
                if (cart[i].qty < 1) {
                    cart.splice(i, 1);
                    if (cart.length == 0) {
                        delete cart
                    }
                }
                delete req.session.shipping
                break;
            case "clear":
                cart.splice(i, 1);
                if (cart.length == 0) {
                    delete cart
                }
                delete req.session.shipping
                break;
            default:
                console.log("update problem");
                break;
        }
        break;
    }
    req.flash("success", "Cart updated!");
    res.redirect("/cart/checkout");
})


/*
* GET  clear cart
*/
router.get("/clear", function (req, res) {
    delete req.session.cart;
    delete req.session.shipping
    req.flash("success", "Cart cleared!");
    res.redirect("/cart/checkout");

})




//Exports
module.exports = router;