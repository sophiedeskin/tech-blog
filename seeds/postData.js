const { Post } = require('../models');

const postData =
[
  {
    "post_title": "How I solved Javascript, a love story",
    "post_text": "I worked really hard.",
    "user_id": 1
  },
  {
    "post_title": "The Ultimate Tech Quiz",
    "post_text": "A web app that will give users 10 new technical questions each day and track their progress in things like programming, cybersecurity, database architecture, and more!",
    "user_id": 2
  },
  {
    "post_title": "Roll 'Em Up",
    "post_text": "A game for Windows and macOS where players move a ball through a series of increasingly challenging mazes.",
    "user_id": 3
  }
]

const seedPost = () => Post.bulkCreate(postData)

module.exports = seedPost
