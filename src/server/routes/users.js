const contacts = require('../../models/contacts')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const saltRounds = 10
const { getUserByEmail, register } = require('../../models/db/users')

router.get('/new', (req, res) => {
  res.render('contacts/new')
})

router.get('/sign-up', (req, res, next) => {
  res.render('contacts/sign-up')
})

router.get('/login', (req, res, next) => {
  res.render('contacts/login')
})

router.post('/sign-up', (req, res, next) => {
  console.log('sending to database')
  const { name, email, password } = req.body

  getUserByEmail(email)
  .then((user) => {
    if(user) {
      res.render('login', {message:'User already exists. Please login'})
    } else {
      bcrypt.hash(password, saltRounds)
        .then(function(hash) {
          register(name, email, hash)
          .then((user) => {
            res.send('You are signed up!')
          })
          .catch(console.error)
        })
        .catch(console.error)
    }
  })
  .catch(console.error)
})

module.exports = router
