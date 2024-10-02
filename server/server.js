import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
//import multer from 'multer'
//import fs from 'fs'
//import {v4 as uuid} from 'uuid'
import router_login from './routers/login.js';
import router_new_hack from './routers/new-hack.js';
import router_search from './routers/search.js';
import router_user_infs from './routers/user_infs.js';
import router_hacks_infs from './routers/hacks_infs.js';
import cors from 'cors';
import process from 'process';
dotenv.config();
const dirfile = fileURLToPath(import.meta.url);
const dirname = path.dirname(dirfile);
const server = express();
server.use('/icon', express.static(path.resolve(dirname, 'files', 'icon')));
server.use('/cover', express.static(path.resolve(dirname, 'files', 'cover')));
server.use('/game', express.static(path.resolve(dirname, 'files', 'game_file')));
server.use(cors());
server.use(router_login, router_new_hack, router_search, router_user_infs, router_hacks_infs);
server.get("/",(req,res)=>{
    res.send("OPen!!!")
})
// server.use(express.json())
// server.use(express.urlencoded({extended: true}))
// server.use(cors())
server.listen(process.env.port || 3001, () => {
    console.clear();
    console.log(`server open on ${process.env.host||"here"}:${process.env.port||"here"}`);
    console.log(dirname);
});
