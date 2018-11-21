const express = require('express');
const chalk = require('chalk');
// 'app' will be shown in the debug message
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mysql');

const app = express();
// the env object stores environment variables that we pass in
const port = process.env.PORT || 3000;

const connection = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2604031',
  database: 'pslibrary'
});

connection.connect(err => debug(err));

app.use(morgan('tiny'));

// add a middleware. That is a function that is executed on every request
// app.use((req, res, next) => {
//   debug('my middleware');
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));
// if our CSS or JS is not in the public folder, next look there
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// set the views directory and templating engine
app.set('views', 'src/views');
app.set('view engine', 'ejs');

const nav = [
  { title: 'Book', link: '/books' }, { title: 'Author', link: '/authors' }
];

// the router is wrapped in a function that accepts nav as an argument
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

// fire a function when the / url is hit
app.get('/', (req, res) => {
  // send back a message
  // res.send('Hello from my library app');
  // send our HTML file
  // use path.join for generating a correct path without worrying about slashes etc
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  // render a view called index from template. It will look into the views directory set up above
  // we can pass in stuff in an object
  res.render('index', {
    title: 'MyLibrary',
    nav: [{ title: 'Books', link: '/books' }, { title: 'Authors', link: '/authors' }],
  });
});


// listen port 3000 and execute a callback
app.listen(port, () => {
  // this logs only when the DEBUG environment variation is set to debug this file
  debug(`listening on port ${chalk.green(port)}`);
});
