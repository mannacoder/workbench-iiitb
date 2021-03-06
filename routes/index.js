const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const _ = require('lodash')

const Post = require('../models/Post')

const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.'

const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'

const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'

// let posts = [];

//Home page
router.get('/', (req, res) => res.render('home'))

//Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      startingContent: homeStartingContent,
      posts: posts,
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent })
})

router.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent })
})

router.get('/compose', ensureAuthenticated, (req, res) => {
  res.render('compose')
})

router.post('/compose', ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Post.create(req.body)
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
  }
})

router.get('/posts/:id', ensureAuthenticated, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id)
    res.render('post', {
      title: post.title,
      content: post.body,
    })
  } catch (error) {
    console.log(error)
  }
})

// router.get('post/edit/:id', ensureAuthenticated, async (req, res) => {
//   const post = await Post.findOne({
//     _id: req.params.id
//   }).lean()
//   if(!post) {
//     console.log("error 404");
//   }
//   if(post.user != req.user.id)
// })

module.exports = router
