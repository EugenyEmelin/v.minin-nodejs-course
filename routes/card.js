const {Router} = require('express')
const Course = require('../models/course')
const User = require('../models/user')
const router = Router()

function mapCartItems(cart) {
  return cart.items.map(c => {
    console.log(c, 'c')
    const result = {
      ...c.courseId._doc,
      count: c.count
    }
    return result
  })
}

function computePrice(courses) {
  return courses.reduce((total, course) => total += course.price * course.count, 0)
}

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  res.status(200).json(card)
})

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate()

  // console.log(user, 'user')

  const courses = mapCartItems(user.cart)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses,
    price: computePrice(courses)
  })
})

module.exports = router