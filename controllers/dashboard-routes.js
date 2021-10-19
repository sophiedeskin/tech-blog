const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");
const withAuth = require('../utils/auth');

// router.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });


module.exports = router;
