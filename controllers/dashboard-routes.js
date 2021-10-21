const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");
const withAuth = require('../utils/auth');

// router.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });
router.get('/edit/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Comment,
          include: {
            model: User,
          }
        },
        {
          model: User,
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
            post,
            loggedIn: true
            });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;
