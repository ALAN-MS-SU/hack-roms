import express from 'express';
import DB from '../db/db.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.get('/search/:value', (req, res) => {
    const value = req.params.value;
    const condition = `h.h_name like('%${value}%') or h.creator like('%${value}%') or h.category like('%${value}%') or h.id = '${value}'`;
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        connection.query(`call select_all('hacks',?,'h_name')`, [condition], (err, rows, fields) => {
            if (err) return console.log(err);
            res.json(rows[0]);
        });
        return connection.release();
    });
});
router.get('/view/:id', (req, res) => {
    const { id } = req.params;
    DB.getConnection((err, connection) => {
        if (err) return console.log(err);
        connection.query(`call select_all('hacks',"id = ?",null)`, [id], (err, rows, fileds) => {
            if (err) return console.log(err);
            res.json(rows[0][0]).end();
        });
        return connection.release();
    });
});
router.get('/download/:rom/:name', (req, res) => {
    const { rom, name } = req.params;
    console.log(`rom: ${rom} \nname: ${name}`);
    res.download(`${process.env.path_game}/${rom}`, `${name}.bps`, (err) => {
        if (err) return console.log(err);
    });
});
export default router;
