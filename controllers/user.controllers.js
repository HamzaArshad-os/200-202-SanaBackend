const Joi = require("joi");
const users = require("../models/user.models");

const getAll = (req, res, next) => {
    users.getAllUsers((err, num_rows, results) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500);
        }
        return res.status(200).send(results);
    })
}

const NewUser = (req, res) => {
    console.log("Here has been here")
    const schema = Joi.object({
        "first_name": Joi.string().required(),
        "last_name": Joi.string().required(),
        "email": Joi.string().email().required(),
        //"password": Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!*?&]{8,16}$/).required() --replaced with my regex -Hamza
        "password": Joi.string().required().min(7).max(15).pattern(new RegExp('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$'))
    });
    console.log("Here has been here")
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    

    let temp_user = Object.assign({}, req.body);

    users.addNewUser(temp_user, (err, id) => {
        if (err) {
             console.log("hello this is our problem");
            return res.sendStatus(500).send(err.details);
        }
           
    

        return res.status(201).send({ user_id: id })
    })
}

const loginUser = (req, res) => {

    const schema = Joi.object({
        "email": Joi.string().email().required(),
        "password": Joi.string().required()
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if (err === 404) return res.status(400).send("Invalid email/password supplied")
        if (err) return res.sendStatus(500)

        users.getToken(id, (err, token) => {
            if (err) return res.sendStatus(500)

            if (token) {
                return res.status(200).send({ user_id: id, session_token: token })
            } else {
                users.setToken(id, (err, token) => {
                    if (err) return res.sendStatus(500)
                    return res.status(200).send({ user_id: id, session_token: token })
                })
            }
        })
    })
}

const logoutUser = (req, res, next) => {
    let token = req.get('X-Authorization');
    users.removeToken(token, (err) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        return res.status(200).send("User logged out"); //wrong status code, you had a few of these - Hamza
    })
}

module.exports = {
    getAll: getAll,
    NewUser: NewUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
}