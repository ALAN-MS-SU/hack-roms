import express from 'express';
import multer from 'multer';
import DB from '../db/db.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import process from 'process';
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
router.post('/new-account', icon.single('Choose your icon'), (req, res) => {
    const name = req.body.name.trim();
    const password = req.body.password.trim();
    const hashtag = req.body.hashtag[0] === '#' ? req.body.hashtag.trim() : `#${req.body.hashtag.trim()}`;
    const file = req.file ? req.file.filename : null;
    if (hashtag == null || hashtag == undefined || hashtag == '' || name == null || name == undefined || name == '' || password == null || password == undefined || password == '') {
        fs.unlink(`server/files/icon/${file}`, (err) => console.log(err));
        return res.sendStatus(500).end();
    }
    console.log(`Primeira validação hashtag: ${hashtag} name: ${name} password: ${password}`);
    if (hashtag.length < 5 || name.length < 4 || password.length < 7) {
        fs.unlink(`${process.env.path_icon}/${file}`, (err) => console.log(err));
        return res.status(500).end();
    }
    console.log(`Segunda validação hashtag: ${hashtag} name: ${name} password: ${password}`);
    console.log(`file: ${file}`);
    DB.getConnection(async (err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        connection.query("call user('insert',?,?,?,?)", [hashtag, name, password, file], (err, rows, fields) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500).end();
            }
            return res.json({ link: `/home/${hashtag.split('#')[1]}`, hashtag: hashtag, name: name, password: password, icon: file });
        });
        return connection.release();
    });
});

router.post('/login', icon.none(), (req, res) => {
    const password = req.body.password.trim();
    const hashtag = req.body.hashtag[0] === '#' ? req.body.hashtag.trim() : `#${req.body.hashtag.trim()}`;
    //console.log(`hashtag: ${hashtag} passsword: ${password}`)

    DB.getConnection(async (err, connection) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500).end();
        }
        connection.query(`call select_all("user","hashtag = ? and password = ?",null)`, [hashtag, password], (err, rows, fields) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500).end();
            }
            if(rows[0] < 1)
                return res.sendStatus(500).end();
            const { u_name, icon } = rows[0][0];
            return res.json({ hashtag: hashtag, name: u_name, password: password, icon: icon });
        });
        return connection.release();
    });
});
export default router;
