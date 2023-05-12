const Joi = require("joi");
const comments = require("../models/comments.models");
//const articles = require("../models/articles.models");
const articles = require("../models/articles.models");
/*
const getComments = (req, res) => {
    let article_id = parseInt(req.params.article_id);
    //Hamza- The issue here was that we needed to verifiy the artile existed first , replaced with my version, will explain another time
    
    comments.getAllComments(article_id, (err, num_rows, results) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        return res.status(200).send(results);
    })

}
*/

const getComments = (req, res) => {
    let article_id = parseInt(req.params.article_id)

    articles.getSingleArticle(article_id, (err, result) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)
        else {
            console.log("HAVE U GOT TO HERE??");
                comments.getAllComments(article_id, (err, num_rows, results) => {
                if (err === 404) {
                    return res.sendStatus(404)//failed
                }
                if (err ===500) {
                    return res.sendStatus(500) //
            
                }
    
                return res.status(200).send(results);
                })
            
            }
        
    })
    
    

}

const addComment = (req, res) => {

    const schema = Joi.object({
        "comment_text": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let comment = Object.assign({}, req.body);
    let article_id = parseInt(req.params.article_id);
    console.log(comment, 'works')

    articles.getSingleArticle(article_id, (err, id) => {
        console.log(article_id, 'article_id is here')

        if (err === 404) return res.sendStatus(404) //lmfao you commented this line out but it would of passed one of your tests - Hamza
        if (err) {
            console.log(res.details);
            return res.sendStatus(500)
            

        }

        else {
            comments.AddNewComment(req.body.comment_text, article_id, (err, id) => {
                // console.log(comment_text, article_id, 'here')

                if (err === 500) return res.sendStatus(500)
                if (err === 404) return res.sendStatus(404)

                return res.status(201).send({ comment_id: id })

            })
        }
    })

}

const deleteComment = (req, res) => {
    let comment_id = parseInt(req.params.comment_id);

    comments.getAllComments(comment_id, (err) => {

        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        console.log("Got to this point qwee")
        comments.deleteC(comment_id, (err, id) => {
            if (err === 500) return res.sendStatus(500)
            if (err === 404) return res.sendStatus(404)
            console.log("Got to this point")
            return res.status(200)
        })
    })
}

module.exports = {
    getComments,
    addComment,
    deleteComment
}