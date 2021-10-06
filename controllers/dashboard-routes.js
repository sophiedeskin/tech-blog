const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");
const withAuth = require('../utils/auth');

router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text"],
        },
      ],
      include: [
        {
          model: User,
          //   attributes: ['filename', 'description'],
          attributes: ["id", "username"],
        },
      ],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
