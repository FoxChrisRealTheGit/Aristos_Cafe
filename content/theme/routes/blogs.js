const express = require("express")
const router = express.Router();

//GET blog category model
const Category = require("../../upgrade/blog/models/blogCategory")
// GET page model
const Page = require("../../../includes/models/page")
//GET blogs model
const Blog = require("../../upgrade/blog/models/blog")


/*
* GET blog index
*/

router.get("/", function (req, res) {
    let slug = req.params.slug;
        Page.find({}, function (err, page) {
            Blog.find({}, function (err, blogs) {
                if (err) {
                    console.log(err);
                }
                if (!page) {
                    res.redirect("/")
                } else {
                    res.render("blogs/all_blogs", {
                        title: page.title,
                        content: page.content,
                        keywords: page.keywords,
                        description: page.description,
                        author: page.author,
                        blogs: blogs
                    })
                }
            })
        })
    })
    



/*
* GET a blog
*/
router.get("/:category/:slug", function (req, res) {
    let slug = req.params.slug;
    Blog.findOne({ slug: slug }, function (err, blog) {
        if (err) {
            console.log(err);
        }
        if (!blog) {
            res.redirect("/")
        } else {
            res.render("blogs/blog", {
                title: blog.title,
                content: blog.content,
                keywords: blog.keywords,
                description: blog.description,
                author: blog.author
            })
        }
    })
})

/*
* GET blogs by category
*/

router.get("/:category", function (req, res) {

    let categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, function (err, c) {
        Blog.find({ category: categorySlug }, function (err, blogs) {
            if (err) {
                console.log(err);
            }
            res.render("blogs/cat_blogs", {
                title: c.title,
                description: c.description,
                author: c.author,
                keywords: c.keywords,
                blogs: blogs,
                categorySlug: categorySlug
            })

        })
    })
})


//Exports
module.exports = router;