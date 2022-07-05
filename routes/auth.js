"use strict";


const Router = require("express").Router;
const router = new Router();

const User  = require("../models/user");
const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res) {
    console.log("login")
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);

    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
    }
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
    console.log("register")
    const { username, password, first_name, last_name, phone } = req.body;
    console.log('user', User)
    const user = await User.register({ username, password, first_name, last_name, phone });
    
    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
    };
    // return next(res.json( user.username, user.password))   
});

module.exports = router;
