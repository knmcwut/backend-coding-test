'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

const {ESLint} = require('eslint');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});


(async function main () {
    const eslint = new ESLint();

    const results = await eslint.lintFiles(['/index.js']);

    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    console.log(resultText);
}()).catch((error) => {
    process.exitCode = 1;
    console.error(error);
});