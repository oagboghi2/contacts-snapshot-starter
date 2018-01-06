const db = require('./db')

const getUserByEmail = function(email){
  console.log('I have the email:', email)
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
}

const register = function(name, email, password){
  return db.one('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password])
}

module.exports = { register, getUserByEmail }
