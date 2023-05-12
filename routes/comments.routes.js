const auth = require("../lib/authentication.js");
const comments = require("../controllers/comments.controllers");

module.exports = function (app) {

   app.route("/articles/:article_id/comments")
      .get(comments.getComments)
      .post( comments.addComment);

   app.route("/comments/:comment_id")
      .delete(auth.isAuthenticated, comments.deleteComment);

}