import express from 'express';
import fs from 'fs';
import multer from 'multer';
import process from 'process';
import { v4 as uuid } from 'uuid';
import DB from '../db/db.js';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './server/files/icon/');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
    }
});
const icon = multer({ storage });
const router = express.Router();
router.post('/new-account', icon.single('Choose your icon'), async (req, res) => {
    const name = req.body.name.trim();
    const password = req.body.password.trim();
    const hashtag = req.body.hashtag[0] === '#' ? req.body.hashtag.trim() : `#${req.body.hashtag.trim()}`;
    const file = req.file ? req.file.filename : null;
    if (hashtag == null || hashtag == undefined || hashtag == '' || name == null || name == undefined || name == '' || password == null || password == undefined || password == '') {
        fs.unlink(`server/files/icon/${file}`, (err) => console.log(err));
        return res.sendStatus(500).end();
    }

    if (hashtag.length < 5 || name.length < 4 || password.length < 7) {
        fs.unlink(`${process.env.path_icon}/${file}`, (err) => console.log(err));
        return res.status(500).end();
    }

    const connection = await DB.connect();
    let data = await connection.query(`call "user"('insert',$1,$2,$3,$4)`, [hashtag, name, password, file]);
    if (data.err) {
        console.log(data.err);
        return res.sendStatus(500).end();
    }
    connection.release();
    return res.json({ hashtag: hashtag, name: name, password: password, icon: file });
});
router.post('/login', icon.none(), async (req, res) => {
    const password = req.body.password.trim();
    const hashtag = req.body.hashtag[0] === '#' ? req.body.hashtag.trim() : `#${req.body.hashtag.trim()}`;
    const connection = await DB.connect();

    let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${hashtag}' and password = '${password}'`]);
    if (data.err) {
        console.log(data.err);
        return res.sendStatus(500).end();
    }
    if (data.rows.length <= 0) return res.sendStatus(500).end();
    const { u_name, icon } = data.rows[0];
    connection.release();
    return res.json({ hashtag: hashtag, name: u_name, password: password, icon: icon });
});
export default router;
