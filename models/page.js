'use strict';

const Sequelize = require('sequelize');
const db = require('./db');

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  hooks: {
    beforeValidate: (page) => {
      if(page.title) {
        page.urlTitle = page.title.replace(/\s+/g,'_').replace(/\W/g, '');
      }
    },
    getterMethods: {
      route: function () {
        return '/wiki/' + this.urlTitle;
      }
    }
  }
});

module.exports = Page;
