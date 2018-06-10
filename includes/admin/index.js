const fs = require("fs-extra");
module.exports = app => {
    const adminPages = require("./routes/pages/admin_pages")

    const adminHome = require("./routes/dashboard/admin_home")

    const adminAddMedia = require("./routes/media/admin_add_media")
    const adminMediaCategories = require("./routes/media/admin_media_categories")

    const adminSettings = require("./routes/settings/admin_settings")
    const adminUserControls = require("./routes/userControls/admin_user_controls")


    app.use("/admin/pages", adminPages)

    app.use("/admin/add-media", adminAddMedia)
    app.use("/admin/media-categories", adminMediaCategories)

    app.use("/admin/settings", adminSettings)
    app.use("/admin/user-controls", adminUserControls)
    app.use("/admin", adminHome)
    fs.pathExists("content/upgrade/blog")
        .then(exists => {
            if (exists) {
                require("../../content/upgrade/blog")(app)
            }
        })
    fs.pathExists("content/upgrade/products")
        .then(exists => {
            if (exists) {
                require("../../content/upgrade/products")(app)

            }
        })
    fs.pathExists("content/upgrade/project-management")
        .then(exists => {
            if (exists) {
                require("../../content/upgrade/project-management")(app)
            }
        })
        fs.pathExists("content/upgrade/portfolio-projects")
        .then(exists => {
            if (exists) {
                require("../../content/upgrade/portfolio-projects")(app)
            }
        })
        fs.pathExists("content/upgrade/contact")
        .then(exists => {
            if (exists) {
                require("../../content/upgrade/contact")(app)
            }
        })
    require("../../content/theme")(app);

}