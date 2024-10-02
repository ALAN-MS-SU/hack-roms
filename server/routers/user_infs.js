import express from 'express';
import DB from '../db/db.js';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import process from 'process';
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

Router.post('/infs-hacks', image.none(), (req, res) => {
    const user = req.body.user.trim() || false;
    const password = req.body.password.trim() || false;
    if (!user || !password) return res.status(500).end();
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        if (
            !connection.query(`call select_all(\'user\',\"hashtag = ? and password = ?\",null)`, [user, password], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return false;
                }
                if (rows[0].length > 0) return true;
                return false;
            })
        )
            return res.status(500).end();
        connection.query(`call select_all(\'hacks\',"creator = ?",\'creator\')`, [user], (err, rows, fields) => {
            if (err) {
                res.status(500).end();
                return console.log(err);
            }
            return res.json(rows[0]);
        });
        return connection.release();
    });
});
Router.delete('/delete-user', image.none(), (req, res) => {
    const user = req.body.user.trim() || false;
    const password = req.body.password.trim() || false;
    if (!user || !password) return res.status(500).end();
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        if (
            !connection.query(`call select_all(\'user\',"hashtag = ? and password = ?",null)`, [user, password], (err, rows, fields) => {
                if (err) return console.log(err);
                if (rows[0].length > 0) {
                    if (rows[0][0].icon !== null) {
                        fs.unlink(`${process.env.path_icon}/${rows[0][0].icon}`, (err) => {
                            if (err) return console.log(err);
                        });
                    }
                    return true;
                }
                return false;
            })
        ) {
            console.log('esse res aqui');
            res.status(500).end();
        }
        connection.query(`call user(\'delete\',?,null,null,null)`, [user], (err, rows, fields) => {
            if (err) console.log(err);
            console.log(rows);
            fs.readdir(`${process.env.path_cover}`, (err, files) => {
                if (err) return console.log(err);
                files.map((file) => {
                    if (file.split('---')[0] === user.split('#')[1]) {
                        console.log('arquivo deletado: ' + file);
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
                        console.log('arquivo deletado: ' + file);
                        return fs.unlink(`${process.env.path_game}/${file}`, (err) => {
                            if (err) return console.log(err);
                        });
                    }
                });
            });
            // console.log(covers)
            // for(let i = 0; i < games.length || i < covers.length;i++){
            //     if(games[i].split("---")[0] === user.split("#")[1]){
            //         fs.unlink(`./server/files/game_file/${games[i]}`,(err)=>{
            //             if(err)
            //                 return console.log(err)
            //         })
            //     }
            //     if(covers[i].split("---")[0] === user.split("#")[1]){
            //         fs.unlink(`./server/files/cover/${covers[i]}`,(err)=>{
            //             if(err)
            //                 return console.log(err)
            //         })
            //     }
            // }
            res.status(200).json({});
        });
        return connection.release();
    });
});
Router.put('/update-user/:user', image.single('icon'), (req, res) => {
    const user = `#${req.params.user.trim()}`;
    const check = req.body.check.trim() || false;
    const name = req.body.name.trim() || false;
    const password = req.body.password.trim() || false;
    const icon = req.file ? req.file : false;
    const old_icon = req.body.old_icon || false;
    if (!user || !name || !password) return res.status(500).end();
    if (name.length < 4 || password.length < 7) return res.status(500).end();
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        if (
            connection.query(`call login(?,?)`, [user, check], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return false;
                }
                if (rows[0].length > 0) {
                    return true;
                }

                res.status(500).end();
                return false;
            })
        ) {
            connection.query(`call user('update',?,?,?,?)`, icon ? [user, name, password, icon.filename] : [user, name, password, old_icon], (err, rows, fields) => {
                if (err) {
                    res.status(500).end();
                    return console.log(err);
                }
                if (icon) {
                    // console.log(`old_icon: ${old_icon}`)
                    //    fs.unlink(`./server/files/icon/${icon.filename}`,(err)=>{
                    //      if(err)
                    //          return console.log(err)
                    //    })
                    fs.unlink(`${process.env.path_icon}/${old_icon}`, (err) => {
                        if (err) return console.log(err);
                    });
                    return res.json({ name: name, password: password, icon: icon.filename }).end();
                }
                return res.json({ name: name, password: password }).end();
            });
        }
        return connection.release();
    });
});
export default Router;
