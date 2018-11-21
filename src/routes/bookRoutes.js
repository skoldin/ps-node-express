const express = require('express');
const bookRouter = express.Router();
const sql = require('mysql');
const debug = require('debug')('app:bookRoutes');

const connection = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2604031',
  database: 'pslibrary'
});

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      connection.query('SELECT * FROM books', (error, results) => {
        if (error) {
          debug(error);
        }
        res.render('bookListView', {
          title: 'Library',
          nav,
          books: results
        });
      });
    });

  bookRouter.route('/:id')
    // this is called before each request so we can use it as middleware
    .all((req, res, next) => {
      // :id is in req.params.id
      const id = +req.params.id;

      connection.query('SELECT * FROM books WHERE id = ?', connection.escape(id), (error, results) => {
        if (error) {
          debug(error);
        }

        req.book = results[0]; // eslint-disable-line prefer-destructuring

        next();
      });
    })
    .get((req, res) => {
      res.render('bookView', {
        title: 'Library',
        nav,
        book: req.book
      });
    });
  return bookRouter;
}

module.exports = router;
