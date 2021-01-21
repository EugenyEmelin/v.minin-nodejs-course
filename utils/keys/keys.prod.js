const DB_NAME = process.env.DB_NAME
const PWD = process.env.PWD
const USER_NAME = process.env.USER_NAME
const DB_CLUSTER = process.env.DB_CLUSTER
const PARAMS = process.env.PARAMS
const SESSION_SECRET = process.env.SESSION_SECRET
const EMAIL_FROM = process.env.EMAIL_FROM
const BASE_URL = process.env.BASE_URL

const CLIENT_ID = process.env.GMAIL_CLIENT_ID
const SECRET_KEY = process.env.GMAIL_SECRET_KEY
const AUTH_CODE = process.env.GMAIL_AUTH_CODE
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
const ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN

module.exports = {
  MONGODB_URI: 'mongodb+srv://Eugeny:LNUcLq6YAQ3Zjy9T@cluster0-rgjk0.mongodb.net/node-course-mongodb?retryWrites=true&w=majority',
  SESSION_SECRET,
  EMAIL_FROM,
  BASE_URL,
  CLIENT_ID,
  SECRET_KEY,
  AUTH_CODE,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
}