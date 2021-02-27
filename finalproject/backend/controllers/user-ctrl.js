const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const env = require('../env.json')
const IDManager = require('../db/id-manager');

const User = require('../db/models/user-model')

const signup = (req, res) => {
    User.find({email: req.body.signupEmail})
        .exec()
        .then(user => {
            if (user.length > 0) {
                console.log(user)
                return res.status(409).json({
                    message: 'Mail already registered'
                })
            }
            else {
                User.find({username: req.body.signupUsername})
                    .exec()
                    .then(user => {
                        if (user.length > 0) {
                            console.log(user)
                            return res.status(409).json({
                                message: 'Username already registered'
                            })
                        }
                        else {
                            bcrypt.hash(req.body.signupPassword, 10, (err, hash) => {
                                if (err) {
                                    console.log(err)
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
                                            console.log(result);
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
                                            console.log(err)
                                            res.status(500).json({
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
const login = (req, res) => {
    console.log(res)
    if (req.body.loginCred.indexOf('@') == -1 ){
        User.find({username: req.body.loginCred})
            .exec()
            .then(user => {
                if (user.length < 1){
                    return res.status(401).json({
                        message: "Auth failed"
                        // message: "Username not found"
                    })
                }
                bcrypt.compare(req.body.loginPassword, user[0].password[0], (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(401).json({
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
                })
            })
            .catch(err => {
                console.log(err)
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
                return res.status(401).json({
                    message: "Auth faileddd"
                    // message: "email not found"
                })
            }
            bcrypt.compare(req.body.loginPassword, user[0].password[0], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        message: "Auth failed"
                        // message: "wrong password"
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
                return res.status(401).json({
                    message: "Auth failed"
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    }
}
const deleteUser = (req, res) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({ 
            message: "user deleted"
        })
    })
    .catch(err => {
        console.log(err)
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