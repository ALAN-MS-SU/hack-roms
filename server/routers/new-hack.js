import express from 'express';
import DB from '../db/db.js';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = file.mimetype.split('/');
        const extension = file.originalname.split('.');
        console.log(`type: ${type[0]} extension: ${extension[extension.length - 1]}`);
        if (type[0] === 'image' && file.fieldname === 'cover') return cb(null, './server/files/cover/');
        if (type[1] === 'octet-stream' && file.fieldname === 'game' && extension[extension.length - 1] === 'bps') return cb(null, './server/files/game_file/');
        try {
            throw new Error('image not accepted');
        } catch (err) {
            err.status = 500;
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const type = file.mimetype.split('/');
        if (type[0] === 'image') return cb(null, `${uuid()}.${type[1]}`);
        if (type[1] === 'octet-stream') return cb(null, `${uuid()}.bps`);
        //  throw new Error("2")
    }
});
const files = multer({ storage: storage });
const router = express.Router();
router.get('/category', files.none(), (req, res) => {
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        connection.query("call select_all('category',null,'category')", (err, rows, fields) => {
            if (err) return console.log(err);
            res.json(rows[0]);
        });
        return connection.release();
    });
});
router.post(
    '/create-hack',
    files.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'game', maxCount: 1 }
    ]),
    (req, res) => {
        const name = req.body.name.trim();
        const hashtag = req.body.user.trim();
        const password = req.body.password.trim();
        const category = req.body.category ? req.body.category.trim() : null;
        const original_game = req.body.original.trim();
        const cover = req.files['cover'] ? `${hashtag.split('#')[1]}---${req.files['cover'][0].filename}` : false;
        const game = req.files['game'] ? `${hashtag.split('#')[1]}---${req.files['game'][0].filename}` : false;
        if (!name || name == '' || !category || category == '' || !original_game || original_game == '' || !hashtag || hashtag == '' || !password || password == '') {
            if (!game && cover) {
                fs.unlink(`${process.env.path_cover}/${cover.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            if (!cover && game) {
                fs.unlink(`${process.env.path_game}/${game.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            if (cover && game) {
                fs.unlink(`${process.env.path_cover}/${cover.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
                fs.unlink(`${process.env.path_game}/${game.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            return res.status(500).end();
        }
        console.log(`primeira validação`);
        if (!game || !cover) {
            if (!game && cover) {
                fs.unlink(`${process.env.path_cover}/${cover}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            if (!cover && game) {
                fs.unlink(`${process.env.path_game}/${game}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            return res.status(500).end();
        }
        DB.getConnection((err, connection) => {
            if (err) return console.log(err);
            if (
                !connection.query(`call select_all('user',"hashtag = ? and password = ?",null)`, [hashtag, password], (err, rows, fields) => {
                    if (err) return console.log(err);
                    if (rows[0]) return true;
                    return false;
                })
            )
                return res.status(500).end();
            if (name.length < 4 || hashtag < 5 || original_game < 3) return res.status(500).end();
            connection.query("call hacks('insert',?,?,?,?,?,?,null)", [name, hashtag, category, original_game, cover, game], (err, rows, fields) => {
                if (err) return console.log(err);
                fs.rename(`${process.env.path_cover}/${cover.split('---')[1]}`, `${process.env.path_cover}/${cover}`, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                });
                fs.rename(`${process.env.path_game}/${game.split('---')[1]}`, `${process.env.path_game}/${game}`, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                });
                return res.json({ user: hashtag.split('#')[1] }).end();
            });
            return connection.release();
        });
    }
);
export default router;
