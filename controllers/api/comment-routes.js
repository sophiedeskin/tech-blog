const router = require('express').Router();
const { User , Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbCommentData = await Comment.findAll({
    });
    res.status(200).json(dbCommentData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


router.post('/', (req, res) => {
  // check the session
  if (req.session) {
    Comment.create({...req.body, user_id: req.session.user_id
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
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

