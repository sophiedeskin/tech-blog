const router = require('express').Router();
const sequelize = require('../config/connection');
const { Comment, Post, User } = require('../models');

// GET all galleries for homepage
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
          ],
        }],
       include: [
            {
              model: User,
            //   attributes: ['filename', 'description'],
            attributes: [
              'id',
              'username',
            ],
            },
      ],
    });

    const posts = dbPostData.map((post) =>
      post.get({ plain: true })
    );
    
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET one gallery
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
          ],
        },      
      ],
      include: [
        {
          model: User,
          attributes: [
            'id',
            'username',
          ],
        },      
      ],
    });

    const post = dbPostData.get({ plain: true });
    res.render('dashboard', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// Login route
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // Otherwise, render the 'login' template
  res.render('login');
});


// Login route
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // Otherwise, render the 'login' template
  res.render('signup');
});
router.get('/new', async (req, res) => {
    res.render('add-post', {
      layout: 'main',
    });
});

router.post('/new', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        post_title: req.body.post_title,
        post_text: req.body.post_text,
      },
    });

    if (!dbPostData) {
      res
        .status(400)
        .json({ message: 'Please enter a text and title!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = dbPostData.id;
      req.session.loggedIn = true;
      res
        .status(200)
        .json({ post: dbPostData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
