const contacts = require('../../models/contacts')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const saltRounds = 10
const { getUserByEmail, register } = require('../../models/db/users')

router.get('/new', (req, res) => {
  res.render('contacts/new')
})

router.get('/sign-up', (req, res, next) => {
  res.render('contacts/sign-up', { counter:0 })
})

router.get('/login', (req, res, next) => {
  res.render('contacts/login')
})

router.post('/sign-up', (req, res, next) => {
  console.log('sending to database')
  const { name, email, password } = req.body

  getUserByEmail(email, password)
  .then((user) => {
    if(user) {
      res.render('contacts/login', {message:'User already exists. Please login'})
    } else {
      bcrypt.hash(password, saltRounds)
        .then(function(hash) {
          register(name, email, hash)
          .then((user) => {
            res.redirect('/users/login')
          })
          .catch(console.error)
        })
        .catch(console.error)
    }
  })
  .catch(console.error)
})

router.post('/login', (req, res, next) => {
  console.log('sending login info to server')
  const { email, password } = req.body
  var counter = 0

  getUserByEmail(email, password)
  .then((user) => {
    console.log(user)
    if(user === null) {
      counter += 1
      res.render('contacts/sign-up',  { counter, message:'User does not exist. Please sign up and try again.'})
    } else {
      res.redirect('/')
    }
  })
  .catch(console.error)
})


module.exports = router
