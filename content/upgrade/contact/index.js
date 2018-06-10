module.exports = app => {
    const adminContact = require("./routes/admin_contact")


    
    app.use("/admin/contact", adminContact)
}