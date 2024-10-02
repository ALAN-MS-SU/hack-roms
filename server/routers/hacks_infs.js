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
const files = multer({
    storage: storage
});
const Router = express.Router();

Router.get('/get-hack/:id', files.none(), (req, res) => {
    const id = req.params.id || false;
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        connection.query(`call select_all("hacks","id = ?",null)`, [id], (err, rows, fields) => {
            if (err) return console.log(err);
            res.json(rows[0][0]);
        });
        return connection.release();
    });
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
    (req, res) => {
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
        DB.getConnection((err, connection) => {
            if (err) return console.log(err);
            if (
                !connection.query(`call select_all("user","hashtag = ? and password = ?",null)`, [user, password], (err, rows, fields) => {
                    if (err) return console.log(err);
                    if (rows[0].length > 0) {
                        console.log('Segunda validação');
                        return true;
                    }
                    console.log('Segunda recusada');
                    delete_files();
                    return false;
                })
            )
                return res.status(500).end();
            if (
                !connection.query(`call select_all('hacks',"id = ? and creator = ?",null)`, [id, user], (err, rows, fields) => {
                    if (err) return console.log(err);
                    if (rows[0].length > 0) {
                        return true;
                    }
                    delete_files();
                    return false;
                })
            )
                return res.status(500).end();
            connection.query(`call hacks('update',?,?,?,?,?,?,?)`, [name, user, category, original, cover ? cover : old_cover, game ? game : old_game, id], (err, rows, fields) => {
                if (err) return console.log(err);
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
                return res.json({}).end();
            });
            return connection.release();
        });
    }
);
Router.delete('/delete-hack', files.none(), (req, res) => {
    const id = req.body.id || false;
    const user = req.body.user || false;
    const password = req.body.password || false;
    const cover = req.body.cover || false;
    const game = req.body.game || false;
    if (!id || !user || !password) return res.status(500).end();
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        if (
            !connection.query(`call select_all('user',"hashtag = ? and password = ?",null)`, [user, password], (err, rows, fields) => {
                if (err) return console.log(err);
                if (rows[0].length > 0) {
                    return true;
                }
                return false;
            })
        ) {
            res.status(500).end();
        }
        connection.query(`call hacks("delete",null,null,null,null,null,null,?)`, [id], (err, rows, fields) => {
            if (err) return console.log(err);
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
            res.end();
        });
        return connection.release();
    });
});
export default Router;
