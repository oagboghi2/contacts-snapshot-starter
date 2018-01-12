const contacts = require('../../models/contacts');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 10;
const validator = require('express-validator');
const passport = require('passport');
const { getUserByEmail, register, login } = require('../../models/db/users')

router.get('/new', authenticationMiddleware(), (req, res) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  if ( !req.session.views){
    req.session.views = 1;
  }else{
    req.session.views += 1;
  }
console.log("count of views " + req.session.views);
  res.render('contacts/new');
});

router.get('/sign-up', (req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  var errors;
  if ( !req.session.views){
    req.session.views = 1;
  }else{
    req.session.views += 1;
  }
  console.log("count of views " + req.session.views);

  res.render('contacts/sign-up', { counter:0, errors: errors });
});

router.get('/login', (req, res, next) => {
  var errors;
  console.log(req.user);
  console.log(req.isAuthenticated());
  if ( !req.session.views){
    req.session.views = 1;
  }else{
    req.session.views += 1;
  }
  console.log("count of views " + req.session.views);


  res.render('contacts/login', { errors: errors });
});

router.get('/logout', (req,res,next) =>{
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.redirect('login')

})

router.post('/sign-up', (req, res, next) => {
  console.log('sending to database');
  const { name, email, password } = req.body;
  const { id } = req.body;

req.checkBody('name', 'name must be between 4-15 characters long.').len(4, 15);
req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
req.checkBody('password', 'Password must be between 3-100 characters long.').len(3, 100);

  var errors = req.validationErrors();
  if (errors) {
    //console.log(errors);
    console.log(errors[0].msg);
    return res.render('contacts/sign-up', { errors: errors[0].msg });
  } else {
    // normal processing here
  };

  getUserByEmail(email, password, )
  .then((user) => {
    if(user) {
      res.render('contacts/login', {message:'User already exists. Please login'})
    } else {
      bcrypt.hash(password, saltRounds)
        .then(function(hash) {
          register(name, email, hash)
          .then((userData) => {
            var user_id = userData.id;
            console.log("testing: This is user_id " + user_id);
            //login() comes directly from passport.js, and this creates a session for the user
            //, and it's going to update it with whatever information we pass through to it.
            req.login(Number(user_id), function(error){
              res.redirect('/home')
            })
          })
        })
        .catch(console.error)
    }
  })
  .catch(console.error)
})

router.post('/login', (req, res, next) => {
  console.log('sending login info to server')
  const { email, password } = req.body
  const { id } = req.body
  var counter = 0

  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 3-100 characters long.').len(3, 100);

    var errors = req.validationErrors();
    if (errors) {
      console.log(errors[0].msg);
      return res.render('contacts/login', { errors: errors[0].msg });
    } else {
      // normal processing here
    };

  getUserByEmail(email)
  .then(async(userData) => {
    console.log(userData)
    const passwordMatch = await bcrypt.compare(password, userData.password)

    console.log(passwordMatch);

    if(userData === null) {

      counter += 1
      res.render('contacts/sign-up',  { counter, message:'User does not exist. Please sign up and try again.'})
    } else {
        console.log("testing 2 " + userData.id);
        var user_id = userData.id;
        //login() comes directly from passport.js, and this creates a session for the user
        //, and it's going to update it with whatever information we pass through to it.
        req.login(user_id, function(error){
          console.log("logged in");
          res.redirect('/home')
        })
      }
    })
    .catch(console.error)
})

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

//serializeUser determines, which data of the user object should be stored in the session.
//The result of the serializeUser method is attached to the session as req.session.passport.user = {}.

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

//The first argument of deserializeUser corresponds to the key of the user object that was given to the done function.
//That key here is the user id (key can be any key of the user object i.e. name,email etc).
//In deserializeUser that key is matched with the in memory array / database or any data resource.

function authenticationMiddleware(){
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/home')
	}
}

module.exports = router
