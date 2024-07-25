var express = require("express");
var router = express.Router();
var Article = require("../models/Article");
var Comment = require("../models/Comment");

// Create article form
router.get("/new", (req, res) => {
  res.render("newArticleForm");
});

// Create article
router.post("/", (req, res, next) => {
  Article.create(req.body)
    .then(() => {
      res.redirect("/article");
    })
    .catch((err) => {
      return next(err);
    });
});

// List articles
router.get("/", (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.render("articles", { articles });
    })
    .catch((err) => {
      return next(err);
    });
});

// Fetch single article
router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id)
    .populate("comments")
    .exec()
    .then((article) => {
      res.render("singleArticle", { article });
    })
    .catch((err) => {
      return next(err);
    });
});

// Edit article form
router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id)
    .then((article) => {
      res.render("editArticleForm", { article });
    })
    .catch((err) => {
      return next(err);
    });
});

// Update article
router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, req.body)
    .then(() => {
      res.redirect("/article/" + id);
    })
    .catch((err) => {
      return next(err);
    });
});

// Delete article
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id)
    .then((article) => {
      Comment.deleteMany({ articleId: article.id })
        .then(() => {
          res.redirect("/article");
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

// Like article
router.get("/:id/like", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    .then(() => {
      res.redirect("/article/" + id);
    })
    .catch((err) => {
      return next(err);
    });
});

// Dislike article
router.get("/:id/dislike", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    .then(() => {
      res.redirect("/article/" + id);
    })
    .catch((err) => {
      return next(err);
    });
});

// Add comment
router.post("/:id/comments", (req, res, next) => {
  var id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body)
    .then((comment) => {
      Article.findByIdAndUpdate(id, { $push: { comments: comment._id } })
        .then((updatedArticle) => {
          res.redirect("/article/" + id);
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

// Update comment form
router.get("/comments/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id)
    .then((comment) => {
      res.render("editCommentForm", { comment });
    })
    .catch((err) => {
      return next(err);
    });
});

// Update comment
router.post("/comments/:id", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body)
    .then((updatedComment) => {
      res.redirect("/article/" + updatedComment.articleId);
    })
    .catch((err) => {
      return next(err);
    });
});

// Delete comment
router.get("/comments/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndDelete(id)
    .then((comment) => {
      Article.findByIdAndUpdate(comment.articleId, {
        $pull: { comments: comment.id },
      })
        .then((article) => {
          res.redirect("/article/" + comment.articleId);
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

// Like comment
router.get("/comments/:id/like", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    .then((comment) => {
      res.redirect("/article/" + comment.articleId);
    })
    .catch((err) => {
      return next(err);
    });
});

// Dislike comment
router.get("/comments/:id/dislike", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { dislikes: 1 } })
    .then((comment) => {
      res.redirect("/article/" + comment.articleId);
    })
    .catch((err) => {
      return next(err);
    });
});

// Export router
module.exports = router;
