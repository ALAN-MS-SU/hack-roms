import express from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import DB from '../db/db.js';
import dotenv from 'dotenv';
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
        //  throw new Error("2")
    }
});
const files = multer({
    storage: storage
});
const Router = express.Router();

Router.get('/get-hack/:id', files.none(), async (req, res) => {
    const id = req.params.id || false;
    const connection = await DB.connect();

    const data = await connection.query(`select * from select_hack($1,'')`, [`id = ${id}`]);
    if (data.err) return console.log(data.err);
    res.json(data.rows[0]);
    connection.release();
});

Router.put(
    '/update-hack',
    files.fields([
        {
            name: 'cover',
            maxCount: 1
        },
        {
            name: 'game',
            maxCount: 1
        }
    ]),
    async (req, res) => {
        const user = req.body.user.trim() || false;
        const password = req.body.password.trim() || false;
        const id = req.body.id || false;
        const name = req.body.name.trim() || false;
        const category = req.body.category || false;
        const original = req.body.original.trim() || false;
        const cover = req.files['cover'] ? `${user.split('#')[1]}---${req.files['cover'][0].filename}` : false;
        const game = req.files['game'] ? `${user.split('#')[1]}---${req.files['game'][0].filename}` : false;
        const old_cover = req.body.old_cover || false;
        const old_game = req.body.old_game || false;
        function delete_files() {
            if (cover) {
                fs.unlink(`${process.env.path_cover}/${cover.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
            }
            if (game) {
                fs.unlink(`${process.env.path_game}/${game.split('---')[1]}`, (err) => {
                    if (err) return console.log(err);
                });
            }
        }
        if (!id || !user || user.length < 5 || !password || name.length < 4 || !name || original.length < 3 || !category || !original) {
            delete_files();
            return res.status(500).end();
        }
        const connection = await DB.connect();
        let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${user}' and password = '${password}'`]);
        if (data.err) return console.log(data.err);
        if (data.rows[0].length <= 0) {
            delete_files();
            return res.status(500).end();
        }
        data = await connection.query(`select * from select_hack($1,'')`, [`id = '${id}' and creator = '${user}'`]);

        if (data.err) return console.log(data.err);
        if (data.rows[0].length <= 0) {
            delete_files();
            return res.status(500).end();
        }

        data = await connection.query(`call hacks('update',$1,$2,$3,$4,$5,$6,$7)`, [name, user, category, original, cover ? cover : old_cover, game ? game : old_game, id]);
        if (data.err) return console.log(data.err);
        if (cover && old_cover) {
            fs.rename(`${process.env.path_cover}/${cover.split('---')[1]}`, `${process.env.path_cover}/${cover}`, (err) => {
                if (err) return console.log(err);
            });
            fs.unlink(`${process.env.path_cover}/${old_cover}`, (err) => {
                if (err) return console.log(err);
            });
        }
        if (game && old_game) {
            fs.rename(`${process.env.path_game}/${game.split('---')[1]}`, `${process.env.path_game}/${game}`, (err) => {
                if (err) return console.log(err);
            });
            fs.unlink(`${process.env.path_game}/${old_game}`, (err) => {
                if (err) return console.log(err);
            });
        }
        connection.release();

        return res.json({}).end();
    }
);
Router.delete('/delete-hack', files.none(), async (req, res) => {
    const id = req.body.id || false;
    const user = req.body.user || false;
    const password = req.body.password || false;
    const cover = req.body.cover || false;
    const game = req.body.game || false;
    if (!id || !user || !password) return res.status(500).end();
    const connection = await DB.connect();
    let data = await connection.query(`select * from select_user($1,'')`, [`hashtag = '${user}' and password = '${password}'`]);
    if (data.err) return console.log(err);
    if (data.rows[0].length <= 0) {
        res.status(500).end();
    }
    data = await connection.query(`call hacks('delete','','','','','','',$1)`, [id]);
    if (data.err) return console.log(data.err);
    if (cover) {
        fs.unlink(`${process.env.path_cover}/${cover}`, (err) => {
            if (err) return console.log(err);
        });
    }
    if (game) {
        fs.unlink(`${process.env.path_game}/${game}`, (err) => {
            if (err) return console.log(err);
        });
    }
    connection.release();
    return res.end();
});

export default Router;
