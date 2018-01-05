const db = require('./db')

const getUserByEmail = function(email, password){
  console.log('I have the email:', email)
  return db.oneOrNone('SELECT FROM users WHERE email = $1 AND password = $2', [email, password])
}

const register = function(name, email, password){
  return db.one('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password])
}

module.exports = { register, getUserByEmail }
