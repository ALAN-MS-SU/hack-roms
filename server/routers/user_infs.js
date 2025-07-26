import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import process from 'process';
import { v4 as uuid } from 'uuid';
import DB from '../db/db.js';
dotenv.config();
const Router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image') return cb(null, `./server/files/icon/`);
        try {
            throw new Error('file not accepted');
        } catch (err) {
            err.status = 500;
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
    }
});
const image = multer({ storage: storage });

Router.post('/infs-hacks', image.none(), async (req, res) => {
    const user = req.body.user.trim() || false;
    const password = req.body.password.trim() || false;
    if (!user || !password) return res.status(500).end();
    const connection = await DB.connect();
    let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${user}' and password = '${password}'`]);
    if (data.err) {
        return console.log(data.err);
    }
    if (data.rows.length <= 0) return res.status(500).end();

    data = await connection.query(`select * from select_hack($1,\'creator\')`, [`creator = '${user}'`]);
    if (data.err) {
        console.log(data.err);
        return res.status(500).end();
    }
    connection.release();
    return res.json(data.rows);
});
Router.delete('/delete-user', image.none(), async (req, res) => {
    const user = req.body.user.trim() || false;
    const password = req.body.password.trim() || false;
    if (!user || !password) return res.status(500).end();
    const connection = await DB.connect();

    let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${user}' and password = '${password}'`]);
    if (data.err) return console.log(data.err);
    if (data.rows.length <= 0) {
        if (data.rows[0].icon !== null) {
            fs.unlink(`${process.env.path_icon}/${rows[0][0].icon}`, (err) => {
                if (err) return console.log(err);
            });
        }
        res.status(500).end();
    }
    
    data = await connection.query(`call "user"(\'delete\',$1,'','','')`, [user]);
    if (data.err) console.log(data.err);
    fs.readdir(`${process.env.path_cover}`, (err, files) => {
        if (err) return console.log(err);
        files.map((file) => {
            if (file.split('---')[0] === user.split('#')[1]) {
                return fs.unlink(`${process.env.path_cover}/${file}`, (err) => {
                    if (err) return console.log(err);
                });
            }
        });
    });
    fs.readdir(`${process.env.path_game}`, (err, files) => {
        if (err) return console.log(err);
        files.map((file) => {
            if (file.split('---')[0] === user.split('#')[1]) {
                return fs.unlink(`${process.env.path_game}/${file}`, (err) => {
                    if (err) return console.log(err);
                });
            }
        });
    });
    connection.release();
    return res.status(200).json({});
});

Router.put('/update-user/:user', image.single('icon'), async (req, res) => {
    const user = `#${req.params.user.trim()}`;
    const check = req.body.check.trim() || false;
    const name = req.body.name.trim() || false;
    const password = req.body.password.trim() || false;
    const icon = req.file ? req.file : false;
    const old_icon = req.body.old_icon || false;
    if (!user || !name || !password) return res.status(500).end();
    if (name.length < 4 || password.length < 7) return res.status(500).end();
    const connection = await DB.connect();

    let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${user}' and password = '${check}'`]);
    if (data.err) {
        console.log(err);
        return res.status(500).end();
    }
    if (data.rows.length <= 0) {
        return res.status(500).end();
    }
    data = await connection.query(`call "user"('update',$1,$2,$3,$4)`, icon ? [user, name, password, icon.filename] : [user, name, password, old_icon]);
    if (data.err) {
        res.status(500).end();
        return console.log(err);
    }
    if (icon) {
        fs.unlink(`${process.env.path_icon}/${old_icon}`, (err) => {
            if (err) return console.log(err);
        });
        connection.release();
        return res.json({ name: name, password: password, icon: icon.filename }).end();
    }
    connection.release();
    return res.json({ name: name, password: password }).end();
});
export default Router;
