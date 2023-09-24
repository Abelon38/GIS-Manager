/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const isAuthenticated = require('./auth/isAuthenticated');
const helmet = require('helmet'); 


const QGIS = require('./routes/qgis');
const Geodata = require('./routes/geodata');

const app = express();
app.set('view engine', 'ejs');
app.set('views', ['views', 'auth']);

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static('logica'));

// Configurar session middleware
app.use(session({
  secret: 'LosPollosHermanos',
  resave: false,
  saveUninitialized: false
}));

// Configurar middleware de Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(QGIS);
app.use(Geodata);

// Configurar las rutas de tu aplicación
app.get('/', (req, res) => {
  res.render('login', { user: req.user, message: req.flash('error') });
});

// Por ejemplo, la ruta de login
app.post('/', passport.authenticate('local', {
  successRedirect: '/qgis',
  failureRedirect: '/',
  failureFlash: true
}));

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/'); // Redirecciona a la página principal después de hacer logout
  });
});

const users = [
  { username: 'admin', password: bcrypt.hashSync('admin', 4) },
  { username: 'usuario2', password: bcrypt.hashSync('contraseña2', 10) },
  // Add more users if necessary
];

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);

    if (!user) {
      return done(null, false, { message: 'Nombre de usuario incorrecto' });
    }

    // Use bcrypt to compare the hashed password stored in the user object
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    });
  }
));

// /visa map
app.get('/map', isAuthenticated, (req, res) => {
  res.render('map', { user: req.user });
});

// Página de error
app.use((req, res, next) => {
  res.status(404).render('404');
});

const port = 3000; // Define el puerto en el que deseas que el servidor escuche

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


