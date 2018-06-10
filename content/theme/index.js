module.exports = app => {
    // GET page model
const Page = require("../../includes/models/page")
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
            })
        }
    })

    const pages = require("./routes/pages")
    const users = require("./routes/users")
    const blogs = require("./routes/blogs")
    const cart = require("./routes/cart")
    const products = require("./routes/products")

    app.use("/blog", blogs)
    app.use("/shop", products)
    app.use("/cart", cart)
    app.use("/users", users)
    app.use("/", pages)
}