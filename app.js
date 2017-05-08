'use strict';

const express = require('express');
const app = express();
const Promise = require('bluebird');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const models = require('./models');

const wikiRouter = require('./routes/wiki');

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { nocache: true });

app.use('/', morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public')));

models.db.sync({ force: true })
.then(() => {
  const server = app.listen(8080, () => {
    console.log('Listening on port 8080!');
  }); 
})
.catch(console.error);

app.use('/wiki', wikiRouter);

app.get('/', (req, res, next) => {
  res.send('Hello there!');
})

app.use((err, req, res, next) => { // 4 args === error handler
  console.error(err);
  res.status(500).send(err.message); // ISE on any uncaught error
})
