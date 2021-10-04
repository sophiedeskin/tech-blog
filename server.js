console.clear();
const path = require('path');
const express = require('express');
// Import express-session
const session = require('express-session');
const exphbs = require('express-handlebars');

const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers, may need to go back and update
const hbs = exphbs.create({ helpers });

// Set up sessions, need to go back and update 
const sess = {
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: true,
  };
  
  app.use(session(sess));
  
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use(routes);
  
  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });
  