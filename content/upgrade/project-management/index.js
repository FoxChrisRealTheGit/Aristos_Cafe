module.exports = app => {
    const adminProjectManagement = require("./routes/admin_project_management")

    app.use("/admin/project-management", adminProjectManagement)
}