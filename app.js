const express = require('express');

const pageRoute = require('./routes/routes');

const app = express();

app.use(pageRoute);

app.listen('3001');