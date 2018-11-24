const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;

      try {
        // waiting for connectin to db server
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        // use the libraryApp database
        const db = client.db(dbName);

        // get our collection
        const col = await db.collection('books');
        const books = await col.find().toArray();

        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books
          }
        );
      } catch (e) {
        debug(e.stack);
      }

      client.close();
    }());
  }
  function getById(req, res) {
    // :id is in req.params.id
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;

      try {
        // waiting for connectin to db server
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server');

        // use the libraryApp database
        const db = client.db(dbName);

        // get our collection
        const col = await db.collection('books');

        // query the first result
        // we can pass in a json object to look for
        // we cannot just pass an object id because it is an objectID object
        const book = await col.findOne({ _id: ObjectID(id) });

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', {
          title: 'Library',
          nav,
          book
        });
      } catch (e) {
        debug(e.stack);
      }

      client.close();
    }());
  }
  function middleware(req, res, next) {
    // if (req.user) {
      next();
    // } else {
    //   res.redirect('/');
    // }
  }
  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;
