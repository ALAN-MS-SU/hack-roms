import express from 'express';
import DB from '../db/db.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.get('/search/:value', async (req, res) => {
    const value = req.params.value;
    const condition = `h.h_name like('%${value}%') or h.creator like('%${value}%') or h.category like('%${value}%') ${/^\d+$/.test(value) ? `or h.id = '${value}'` : ''}`;
    const connection = await DB.connect();

    let data = await connection.query(`select * from select_hack($1,'h.h_name')`, [condition]);
    if (data.err) return console.log(data.err);
    connection.release();
    return res.json(data.rows);
});
router.get('/view/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await DB.connect();
    let data = await connection.query(`select * from select_hack($1,'')`, [`id = ${id}`]);
    if (data.err) return console.log(data.err);
    connection.release();
    return res.json(data.rows[0]).end();
});
router.get('/download/:rom/:name', (req, res) => {
    const { rom, name } = req.params;
    res.download(`${process.env.path_game}/${rom}`, `${name}.bps`, (err) => {
        if (err) return console.log(err);
    });
});
export default router;
