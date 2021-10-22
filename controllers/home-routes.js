const router = require('express').Router();
const sequelize = require('../config/connection');
const { Comment, Post, User } = require('../models');


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
  layout: 'dashboard',
});
});


router.get('/dashboard', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id,
      },
    });
    const posts = dbPostData.map((post) =>
    post.get({ plain: true })
  );
  
  res.render('dashboard', {
    layout: 'dashboard', posts,
  });
} catch (err) {
  console.log(err);
  res.status(500).json(err);
}
});

router.get('/posts/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    include: [{ model: User }],
    include: [{ model: Comment }],
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post', {
        layout: 'main',
          post,
          loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('posts/:id', async (req, res) => {
  try {
    const [affectedRows] = Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.delete('edit/:id', async (req, res) => {
  try {
    const [affectedRows] = Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router;
