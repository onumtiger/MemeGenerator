const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const env = require('../env.json')
const IDManager = require('../db/id-manager');

const User = require('../db/models/user-model')

/**
 * Create a new user in database with the information received in request
 * return success or error message in case of unsuccessful registration
 * @param {*} req 
 * @param {*} res 
 */
const signup = (req, res) => {
    User.find({email: req.body.signupEmail})
        .exec()
        .then(user => {
            if (user.length > 0) {
                console.log('Mail already registered!')
                return res.status(409).json({
                    message: 'Mail already registered'
                })
            }
            else {
                User.find({username: req.body.signupUsername})
                    .exec()
                    .then(user => {
                        if (user.length > 0) {
                            console.log("User already exists, ID: ",user._id);
                            return res.status(409).json({
                                message: 'Username already registered'
                            })
                        }
                        else {
                            bcrypt.hash(req.body.signupPassword, 10, (err, hash) => {
                                if (err) {
                                    console.log("Could not hash password: ",err);
                                    return res.status(500).json({
                                        error: err
                                    })
                                } else {
                                    const user = new User({
                                        _id: IDManager.getNewEmptyUserID(),
                                        email: req.body.signupEmail,
                                        username: req.body.signupUsername,
                                        password: hash
                                    })
                                    user
                                        .save()
                                        .then( result => {
                                            IDManager.registerNewUserEntry();
                                            const token = jwt.sign(
                                                {
                                                    email: user.email,
                                                    username: user.username,
                                                    userId: user._id
                                                },
                                                env.jwtKey, {
                                                    expiresIn: "5h"
                                                }
                                            )
                                            res.status(201).json({
                                                message: 'user created!',
                                                id: user._id,
                                                token: token
                                            })
                                        })
                                        .catch(err => {
                                            console.log("Signup failed, invalid input: ",err)
                                            res.status(400).json({
                                                error: err
                                            })
                                        })
                                }
                            })
                        }
                    })
            }
        })
}

/**
 * returns jwt token if login credentials are correct
 * otherwise error message is returned
 * @param {*} req 
 * @param {*} res 
 */
const login = (req, res) => {
    if (req.body.loginCred.indexOf('@') == -1 ){
        User.find({username: req.body.loginCred})
            .exec()
            .then(user => {
                if (user.length < 1){
                    console.log("Username not found");
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                bcrypt.compare(req.body.loginPassword, user[0].password[0], (err, result) => {
                    if (err) {
                        console.log("Could not validate password via username")
                        return res.status(500).json({
                            message: "Auth failed"
                        })
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                username: user[0].username,
                                userId: user[0]._id
                            },
                            env.jwtKey, {
                                expiresIn: "5h"
                            }
                        )

                        return res.status(200).json({
                            message: 'auth successful',
                            token: token
                        })
                    }
                    console.log("Wrong password via username")
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                })
            })
            .catch(err => {
                console.log("Auth failed via username: ",err)
                res.status(500).json({
                    error: err
                })
            })
    }
    else {
        User.find({email: req.body.loginCred})
        .exec()
        .then(user => {
            if (user.length < 1){
                console.log("email not found");
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            bcrypt.compare(req.body.loginPassword, user[0].password[0], (err, result) => {
                if (err) {
                    console.log("Could not validate password via email")
                    return res.status(500).json({
                        message: "Auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            username: user[0].username,
                            userId: user[0]._id
                        },
                        env.jwtKey, {
                            expiresIn: "5h"
                        }
                    )

                    return res.status(200).json({
                        message: 'auth successful',
                        token: token
                    })
                }
                console.log("Wrong password via email")
                return res.status(401).json({
                    message: "Auth failed"
                })
            })
        })
        .catch(err => {
            console.log("Auth failed via email: ",err)
            res.status(500).json({
                error: err
            })
        })
    }
}

/**
 * deletes user in db
 * @param {*} req 
 * @param {*} res 
 */
const deleteUser = (req, res) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({ 
            message: "user deleted"
        })
    })
    .catch(err => {
        console.log("Failed to delete user: ",err)
        res.status(500).json({
            error: err
        })
    })
}

module.exports = {
    signup,
    login,
    deleteUser
}