const db = require("../../database");


const getAllComments = (article_id, done) => {
    const results = [];

    db.each(
        "SELECT * FROM comments WHERE article_id=?",
        [article_id],// you forgot o put article_id in here - Hamza
        (err, row) => {
            if (err) return done(err);

            results.push({
                comment_id: row.comment_id,
                date_published: new Date(row.date_published).toLocaleDateString(),
                comment_text: row.comment_text,
                //article_id: row.article_id
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const AddNewComment = (comment_text, article_id, done) => {
    let date = Date.now();
    const sql = 'INSERT INTO comments (comment_text, date_published, article_id) VALUES (?,?,?)';
    let values = [comment_text, date, article_id];

    db.run(
        sql,
        values,
        function (err) {
            if (err) return done(err, null);
            return done(null, this.lastID);
        }
    )
}

const getSingleComment = (id, done) => { //no need to export as it isonly ever used inside of this model. In future may need to export- Hamza
    const sql = 'SELECT * FROM comments WHERE comment_id=?'
    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)

        return done(null, {
           comment_id: row.comment_id
        })
    })
}

const deleteC = (id, done) => { //replaced your deeltecomment method for convinience but 
    // need to check if comment exists first to pass some tests as done below - Hamza
    // the getSingleComment is also a function that we had to make by ourselves, I dont blame you for not getting this part, it was hard and annoying
    //getSingleComment above -Hamza
     getSingleComment(id, (err) => {
        if (err === 404) {
            console.log("Comment does not exist")
            return done(err)
        }
       

        else {
             const sql = 'DELETE from comments WHERE comment_id=?';
                let values = [id];
    


            db.run(sql, values, (err) => {
                if (err) return done(err, null);
                return done(err)
            })

        }
    
        
    })
    


   

    }

module.exports = {
    getAllComments: getAllComments,
    AddNewComment: AddNewComment,
    deleteC: deleteC,
}