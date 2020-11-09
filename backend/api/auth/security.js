const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const secret = 'DWFS'

function validateUser(req, res, next) {
    try {
        req.token_info.is_admin ? next() : res.status(401).json("Unauthorized - Not an admin");
    } catch (error) {
        console.log(error);
    }
}

const validateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verification = jwt.verify(token, secret);
        req.token_info = verification;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json('token no válido');
    }
}

const createToken = (req, res, payload) => {
    try {
        const token = jwt.sign(payload, secret);
        res.status(200).json({ token });
        console.log({ token });
    } catch (error) {
        console.log(error);
        res.status(401).json('token no válido');
    }
}

function is_numeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value) ? value : !isNaN(parseFloat(value)) && isFinite(value);
}

function validateAdmin(req, res) {
    try {
        return req.token_info.is_admin == 0 ? req.token_info.user_id : 'is_admin';
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    validateToken,
    createToken,
    validateUser,
    is_numeric,
    validateAdmin
}