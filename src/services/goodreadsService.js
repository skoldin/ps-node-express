const axios = require('axios');
const debug = require('debug')('app:goodReadsService');
const xml2js = require('xml2js');

const parser = xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  function getBookById(id) {
    // return a promise so that we can use await
    return new Promise((resolve, reject) => {
      // todo: replace the api key, this one is reset
      axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=lacFttL1uI3w86DMjPEhJg`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((e) => {
          reject(e);
          debug(e);
        });
    });
  }

  return {
    getBookById
  };
}
module.exports = goodreadsService();
