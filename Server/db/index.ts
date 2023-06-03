import {Pool} from 'pg';
import {POSTGRES_URL } from '../config';


const pool = new Pool({
    connectionString: POSTGRES_URL + "?sslmode=require",
})

pool.connect((err)=>{
    if(err) throw err
    console.log('Database connected')
})

export default {
    query:(text:string,params?:any[])=>pool.query(text,params)
}