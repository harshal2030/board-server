const express = require('express');

const User = require('./../models/user');

const {avatarPath} = require('./../utils/paths');

const router = express.Router();

router.get('/user/:username/avatar', async (req, res) => {
    try {
        const user =  await User.findOne({
            where: {
                username: req.params.username,
            },
            attributes: ['avatar']
        });

        if (!user) {
            throw new Error()
        }

        res.sendFile(`${avatarPath}/${user.avatar}`);
    } catch (e) {
        res.sendStatus(400);
    }
})

module.exports = router;
