const db = require("../../database");

const getAllArticles = (done) => {
    const results = [];

    db.each(
        "SELECT * FROM articles",
        [],
        (err, row) => {
            if (err) console.log("Something went wrong: " + err);

            results.push({
                article_id: row.article_id,
                title: row.title,
                author: row.author,
                date_published: new Date(row.date_published).toLocaleDateString(),
                date_edited: new Date(row.date_edited).toLocaleDateString(),
                article_text: row.article_text
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const addNewArticle = (articles, done) => {
    let date = Date.now();

    const sql = 'INSERT INTO articles (title, author, date_published, date_edited, article_text, created_by) VALUES (?,?,?,?,?,?)';
    let values = [articles.title, articles.author, date, date, articles.article_text, 1];

    db.run(
        sql,
        values,
        function (err) {
            if (err) return done(err, null);

            return done(null, this.lastID);
        }
    )
}

const getSingleArticle = (id, done) => {
    const sql = 'SELECT * FROM articles WHERE article_id=?'

    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)

        return done(null, {
            article_id: row.article_id,
            title: row.title,
            author: row.author,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            article_text: row.article_text
        })
    })
}

const updateArticle = (id, articles, done) => {
    const sql = 'UPDATE articles SET title=?, author=?, article_text=? WHERE article_id=?'
    let values = [articles.title, articles.author, articles.article_text, id];

    db.run(sql, values, (err) => {
        return done(err)
    })
}

const deleteArticle = (id, done) => {
    const sql = 'DELETE FROM articles WHERE article_id=?'

    let values = [id];

    db.run(sql, values, (err) => {
        return done(err);
    })
}

module.exports = {
    getAllArticles: getAllArticles,
    addNewArticle: addNewArticle,
    getSingleArticle: getSingleArticle,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle,
}