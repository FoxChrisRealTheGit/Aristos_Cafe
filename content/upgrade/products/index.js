module.exports = app => {
    const adminProductCategories = require("./routes/admin_product_categories")
    const adminProducts = require("./routes/admin_products")

    if (app.locals.printfulPluginExists) {
        const printfulPlugin = require("../../plugins/printful/colors_sizes")

        app.use("/admin/printful", printfulPlugin)
    }

    app.use("/admin/product-categories", adminProductCategories)
    app.use("/admin/products", adminProducts)
}