'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;

router.get('/', (req, res) => {

});

router.post('/', (req, res, next) => {
  let newPage = Page.build(req.body);
  newPage.save()
  .then(() => {
    console.log('Page was saved!');
    res.redirect('/wiki');
  })
  .catch((err) => {
    next(err);
  })
});

router.get('/add', (req, res) => {
  res.render('addpage');
});

router.get('/:urlTitle', (req, res, next) => { // Parameterized routes below
  let urlTitleOfAPage = req.params.urlTitle;
  Page.findOne({
    where: {
      urlTitle: urlTitleOfAPage
    }
  })
  .then((page) => {
    if(page === null) return next(new Error('Page not found'));
    res.render('wikipage', {
      page: page
    });
  })
  .catch(next);
})

module.exports = router;
