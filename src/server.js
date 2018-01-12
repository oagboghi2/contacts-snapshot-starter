const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const session = require('express-session')
const passport = require('passport');
const methodOverride = require('method-override')
const routes = require('./server/routes');
const middlewares = require('./server/middlewares');
const PostgreSqlStore = require('connect-pg-simple')(session);



const app = express()

//////////Middleware

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(middlewares.setDefaultResponseLocals)
app.use(validator())
app.use(session({
  secret: 'btsbbabberbrbtr',
  resave: false,
  saveUninitialized: false,
  store : new PostgreSqlStore({conString: "postgres://localhost:5432/contacts_development"}),
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))
app.use(passport.initialize());
app.use(passport.session());

///////Routes
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use('/', routes)

app.use((request, response) => {
  response.render('common/not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
