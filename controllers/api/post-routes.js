const router = require('express').Router();
const { User , Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbPostData = await Post.findAll({
        include: [{ model: User }],
        include: [{ model: Comment }],
    });
    res.status(200).json(dbPostData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// router.get('/:id', (req, res) => {
//   Post.findOne({
//     where: {
//       id: req.params.id
//     },
//     include: [
//       {
//         model: User,
//       },
//       {
//         model: Comment,
//         include: {
//           model: User,
//         }
//       }
//     ]
//   })
//     .then(dbPostData => {
//       if (!dbPostData) {
//         res.status(404).json({ message: 'No post found with this id' });
//         return;
//       }
//       res.json(dbPostData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const dbPostData = await  Post.findOne({
      where: {
        id: req.params.id
      },
      include: [{ model: User }],
      include: [{ model: Comment }],
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }

    res.status(200).json(dbPostData);
  } catch (err) {
    res.status(500).json(err);
  }

});


// CREATE new user
router.post('/',  async (req, res) => {
  console.log(req.body)
  try {

    const newPost = await Post.create({...req.body, user_id: req.session.user_id})
    res.json(newPost)
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

    const updatePost = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updatePost);


  } catch (error) {
    res.status(500).json(error);
  }
})

router.delete('/:id', async (req, res) => {
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
