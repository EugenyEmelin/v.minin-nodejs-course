const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5f7a6e85297ba72678c8239c')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
  
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

const dbname = 'node-course-mongodb'
const password = 'kNVG8WKRfgIWzJEW'

async function start() {
  try {
    const url = `mongodb+srv://Eugeny:${password}@cluster0-rgjk0.mongodb.net/${dbname}?retryWrites=true&w=majority`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'emelin.eug@ya.ru',
        name: 'Evgeniy',
        cart: {items: []}
      })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()


