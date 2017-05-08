'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => {
  Page.findAll({})
  .then((pages) => {
    res.render('index', {
      pages: pages
    })
  })
  .catch(next);
});

router.post('/', (req, res, next) => {
  const body = req.body;
  
  User.findOrCreate({
    where: {
      email: body.authorEmail,
      name: body.authorName
    }
  })
  .spread((user, wasCreatedBool) => { // Bluebird function
    return Page.create({
      title: body.title,
      content: body.content,
      status: body.status
    })
    .then((createdPage) => {
      return createdPage.setAuthor(user);
    })
  })
  .then((createdPage) => {
    res.redirect('/wiki/' + createdPage.urlTitle);
  })
  .catch(next);
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
    page.getAuthor()
    .then((author) => {
      page.author = author;
      res.render('wikipage', {
        page: page
      });   
    })
  })
  .catch(next);
})

module.exports = router;
