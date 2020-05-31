const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const sharp = require('sharp');
const { v4 } = require('uuid')

const User = require('../models/user');
const Board = require('./../models/board');

const {postImgPath} = require('./../utils/paths')

const { auth } =require('./../middlewares/auth');

const router = express.Router();

const upload = multer({
    limits: {
      fileSize: 200 * 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mkv)$/)) {
        return cb(Error('Unsupported files uploaded to the server'));
      }
  
      return cb(undefined, true);
    },
  });
  
  const mediaMiddleware = upload.fields([
    { name: 'image', maxCount: 1 },
  ]);

router.post('/user/signup', async (req, res) => {
    try {
        const user = await User.create(req.body);
        const [token, userData] = await Promise.all([user.generateAuthToken(), user.removeSensetiveInfo()])
        res.send({ user: userData, token });
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
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

router.post('/user/token', auth, async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.user.username,
            },
            attributes: ['name', 'username', 'bio']
        })

        res.send(user);
    } catch (e) {
        res.sendStatus(400)
    }
})

router.post('/board', mediaMiddleware, auth, async (req, res) => {
    try {
        const body = JSON.parse(req.body.info);
        const file = req.files;
        // process image
        if (file.image !== undefined) {
            console.log('if of imAGE');
            const filename = `${v4()}.webp`;
            const filePath = `${postImgPath}/${filename}`;
            await sharp(file.image[0].buffer).webp({ lossless: true }).toFile(filePath);
            body.mediaPath = `${filename}`;
        }
        await Board.create(body);
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(400)
    }
})

module.exports = router;
