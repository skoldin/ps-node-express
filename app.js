const express = require('express');
const chalk = require('chalk');
// 'app' will be shown in the debug message
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
// the env object stores environment variables that we pass in
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library', resave: false, saveUninitialized: false }));

// add a middleware. That is a function that is executed on every request
// app.use((req, res, next) => {
//   debug('my middleware');
//   next();
// });

require('./src/config/passport.js')(app);

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
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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
    nav,
  });
});


// listen port 3000 and execute a callback
app.listen(port, () => {
  // this logs only when the DEBUG environment variation is set to debug this file
  debug(`listening on port ${chalk.green(port)}`);
});
