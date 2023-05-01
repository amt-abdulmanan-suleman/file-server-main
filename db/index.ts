import {Pool} from 'pg';
import { PASSWORD } from '../config';


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'file_server',
    password: PASSWORD,
    port: 5432,
})

export default {
    query:(text:string,params?:any[])=>pool.query(text,params)
}