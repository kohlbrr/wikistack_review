'use strict';

const db = require('./db');
const Page = require('./page');
const User = require('./user');

Page.belongsTo(User, {as: 'author'})

module.exports = {
  db: db,
  Page: Page,
  User: User
};
