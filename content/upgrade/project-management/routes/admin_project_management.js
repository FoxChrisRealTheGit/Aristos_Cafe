const express = require("express")
const router = express.Router();
const auth = require("../../../../includes/config/auth")
const Logger = require("../../../../includes/AristosLogger/AristosLogger").Logger;
const isAdmin = auth.isAdmin;

// GET task model
const Tasks = require("../models/tasks")

// GET user model
const User = require("../../../../includes/models/user")

//GET media model
const Media = require("../../../../includes/models/media")

/*
* GET project management index
*/
router.get("/", isAdmin, function (req, res) {
    Tasks.find({}, function (err, tasks) {
        if (err) { Logger.error(err) };
        res.render("../../upgrade/project-management/views/project-management", {
            content: "",
            tasks: tasks
        })
    })
})

/*
* GET add tasks
*/
router.get("/add-task", isAdmin, function (req, res) {
    let taskName = "";
    let content = "";
    let assigned = "";
    let completed = 0;
    User.find({ admin: 1 }, function (err, user) {
        if (err) { Logger.error(err) };
        Media.find({}, function (err, media) {
            if (err) { Logger.error(err) };
            res.render("../../upgrade/project-management/views/tasks/add_task", {
                content: "",
                taskName: taskName,
                content: content,
                assigned: assigned,
                completed: completed,
                user: user,
                media: media
            })
        })
    })
})


/*
* POST add task
*/
router.post("/add-task", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("taskName", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();

            let taskName = req.body.taskName;
            let content = req.body.content;
            let assigned = req.body.assigned;
            let errors = req.validationErrors();

            if (errors) {
                User.find({ admin: 1 }, function (err, user) {
                    if (err) { Logger.error(err) };
                    return res.render("../../upgrade/project-management/views/tasks/add_task", {
                        errors: errors,
                        taskName: taskName,
                        assigned: assigned,
                        content: content,
                        user: user
                    })
                })
            } else {
                let task = new Tasks({
                    title: taskName,
                    assigned: assigned,
                    content: content,
                    completed: 0
                });
                task.save(function (err) {
                    if (err) { Logger.error(err) };

                    req.flash("success", "Task added!");
                    res.redirect("/admin/project-management");
                })
            }
        } else {
            res.redirect("/users/login");
        }
    })
})


/*
* Get edit task
*/
router.get("/edit-task/:id", isAdmin, function (req, res) {
    User.find({ admin: 1 }, function (err, user) {
        if (err) { Logger.error(err) };
        Tasks.findById(req.params.id, function (err, tasks) {
            if (err) { Logger.error(err) };
            Media.find({}, function (err, media) {
                if (err) { Logger.error(err) };
                res.render("../../upgrade/project-management/views/tasks/edit_task", {
                    content: "",
                    taskName: tasks.title,
                    assigned: tasks.assigned,
                    content: tasks.content,
                    user: user,
                    id: tasks._id,
                    media: media
                })
            })
        })
    })
})



/*
* POST edit task
*/
router.post("/edit-task/:id", function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) { Logger.error(err) };
        if (user.admin === 1) {
            req.checkBody("taskName", "Title must have a value.").notEmpty();
            req.checkBody("content", "Content must have a value.").notEmpty();

            let taskName = req.body.taskName;
            let content = req.body.content;
            let assigned = req.body.assigned;
            let id = req.params.id;
            let errors = req.validationErrors();


            if (errors) {
                User.find({ admin: 1 }, function (err, user) {
                    if (err) { Logger.error(err) };
                    return res.render("../../upgrade/project-management/views/tasks/add_task", {
                        errors: errors,
                        taskName: taskName,
                        assigned: assigned,
                        content: content,
                        user: user
                    })
                })
            } else {
                Tasks.findById(id, function (err, tasks) {
                    if (err) { Logger.error(err) };

                    tasks.title = taskName;
                    tasks.content = content;
                    tasks.assigned = assigned;

                    tasks.save(function (err) {
                        if (err) { Logger.error(err) };

                        req.flash("success", "Task Updated!");
                        res.redirect("/admin/project-management");
                    })
                })

            }
        } else {
            res.redirect("/users/login");
        }
    })
})

/*
* POST complete a task
*/
router.get("/complete-task/:id", function (req, res) {

    Tasks.findById(req.params.id, function (err, task) {
        if (err) { Logger.error(err) 
        } else {
            task.completed = 1;

            task.save(function (err) {
                if (err) { Logger.error(err)
                } else {
                    Tasks.find({}, function (err, tasks) {
                        if (err) { Logger.error(err) };
                        res.render("../../upgrade/project-management/views/project-management", {
                            content: "",
                            tasks: tasks
                        })
                    })
                }
            })
        }
    })
})

/*
* GET delete task
*/
router.get("/delete-task/:id", isAdmin, function (req, res) {
    Tasks.findByIdAndRemove(req.params.id, function (err, task) {
        if (err) { Logger.error(err)
        } else {
            Tasks.find({}, function (err, tasks) {
                if (err) { Logger.error(err) };
                res.render("../../upgrade/project-management/views/project-management", {
                    content: "",
                    tasks: tasks,
                    id: tasks._id
                })
            })
        }
    })
})

//Exports
module.exports = router;