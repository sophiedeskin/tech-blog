const router = require('express').Router();
const { User , Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbCommentData = await Comment.findAll({
        include: [{ model: User }],
        include: [{ model: Post }],
    });
    res.status(200).json(dbCommentData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  // update a comment by its `id` value
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Please provide an id to update to" })
    }

    const updateComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updateComment);


  } catch (error) {
    res.status(500).json(error);
  }
})
// CREATE new user
router.post('/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.create({
      comment_text: req.body.comment_text,
    });

    req.session.save(() => {
      req.session.logged_in = true;
      res.status(200).json(dbCommentData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const dbCommentData = await Comment.destroy({
            where: {
                id: req.params.id
              }
        });
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
          }
      
        req.session.save(() => {
          req.session.logged_in = true;
          res.status(200).json(dbCommentData);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
  });


module.exports = router;

