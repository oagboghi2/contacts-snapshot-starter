const router = require('express').Router();
const contactsRoutes = require('./contacts')
const usersRoutes = require('./users')
const contacts = require('../../models/contacts');
const middlewares = require('../middlewares');


router.get('/home', (req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  // if ( !req.session.views){
  //   req.session.views = 1;
  // }else{
  //   req.session.views += 1;
  // }

  if(req.isAuthenticated == true){
    var loggedIn = "Active"
  }else{
    var loggedIn;
  }
  console.log("count of views " + req.session.views);

  contacts.findAll()
    .then((contacts) => {res.render('contacts/index', { loggedIn: loggedIn, contacts, message: null })})
    .catch( error => next(error) )
})

router.use('/contacts', contactsRoutes)
router.use('/users', usersRoutes)

router.use(middlewares.logErrors);
router.use(middlewares.errorHandler);
router.use(middlewares.notFoundHandler)

module.exports = router;
