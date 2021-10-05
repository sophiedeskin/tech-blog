const router = require('express').Router();
const { User , Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbUserData = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
      include: [{ model: Comment }],
    });
    res.status(200).json(dbUserData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const dbUserData = await User.findByPk(req.params.id, {
      include: [{ model: Post }],
      include: [{ model: Comment }],
    });

    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with that id!' });
      return;
    }

    res.status(200).json(dbUserData);
  } catch (err) {
    res.status(500).json(err);
  }

});


// CREATE new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a post by its `id` value
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Please provide an id to update to" })
    }

    const updateUser = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updateUser);


  } catch (error) {
    res.status(500).json(error);
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.loggedIn = true;
      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  // When the user logs out, the session is destroyed
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
