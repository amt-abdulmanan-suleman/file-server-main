"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config");
const pool = new pg_1.Pool({
    connectionString: config_1.POSTGRES_URL + "?sslmode=require",
});
pool.connect((err) => {
    if (err)
        throw err;
    console.log('Database connected');
});
exports.default = {
    query: (text, params) => pool.query(text, params)
};
