/* const express = require('express');
const app = express();
const path = require('path'); */

import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, './game')));
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, () => {
  console.log('app listening on http://localhost:3000');
});
