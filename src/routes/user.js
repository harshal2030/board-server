const express = require('express');
const { Op } = require('sequelize');

const User = require('../models/user');

const router = express.Router();

router.post('/user/signup', async (req, res) => {
    try {
        const user = await User.create(req.body);
        const [token, userData] = await Promise.all([user.generateAuthToken(), user.removeSensetiveInfo()])
        res.send({ user: userData, token });
    } catch (e) {
        res.sendStatus(400);
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.user, req.body.password);

        const [token, userData] = await Promise.all([user.generateAuthToken(), user.removeSensetiveInfo()]);
        res.send({ user: userData, token });
    } catch (e) {
        res.sendStatus(400);
    } 
})

module.exports = router;
