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
        if (type[0] === 'image' && file.fieldname === 'cover') return cb(null, './server/files/cover/');
        if ((type[1] === 'octet-stream' || type[1] === 'x-bps-patch') && file.fieldname === 'game' && extension[extension.length - 1] === 'bps') return cb(null, './server/files/game_file/');
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
        if (type[1] === 'octet-stream' || type[1] === 'x-bps-patch') return cb(null, `${uuid()}.bps`);
    }
});
const files = multer({ storage: storage });
const router = express.Router();
router.get('/category', files.none(), async (req, res) => {
    const connection = await DB.connect();
    let data = await connection.query("select * from select_category('','category')");
    if (data.err) return console.log(data.err);
    connection.release();
    return res.json(data.rows);
});
router.post(
    '/create-hack',
    files.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'game', maxCount: 1 }
    ]),
    async (req, res) => {
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
        const connection = await DB.connect();

        let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${hashtag}' and password = '${password}'`]);

        if (data.err) return console.log(data.err);
        if (data.rows <= 0) return res.status(500).end();

        if (name.length < 4 || hashtag < 5 || original_game < 3) return res.status(500).end();
        data = await connection.query(`call hacks('insert',$1,$2,$3,$4,$5,$6,null)`, [name, hashtag, category, original_game, cover, game]);
        if (data.err) return console.log(data.err);
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
        connection.release();
        return res.sendStatus(200).end();
    }
);
export default router;
