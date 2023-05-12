const articles = require("../controllers/articles.controllers");
const auth = require("../lib/authentication");

module.exports = function (app) {

    app.route("/articles")
        .get(articles.getAll)
        .post(auth.isAuthenticated, articles.create); // auth.isAuthenticated,

    app.route("/articles/:article_id")
        .get(articles.getOne)
        .patch(auth.isAuthenticated, articles.updateArticle)
        .delete(auth.isAuthenticated, articles.deleteArticle);
}