const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
      .isEmail({
        domain_specific_validation: false
      })
      .withMessage('Введитте корректный email')
      .custom(async (value, {req}) => {
        try {
          const user = await User.findOne({
            email: value
          })
          if (user) {
            return Promise.reject('Пользователь с таким email уже зарегистрирован')
          }
        } catch(e) {
          console.log(e)
        }
      })
      .trim(),

    body('password', 'Некорректный пароль')
      .isLength({min: 6, max: 32})
      .isAlphanumeric()
      .trim(),

    body('confirm')
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('Пароли не совпадают')
        }
        return true
      })
      .trim(),

    body('name').isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа')
]

const courseTitleValidator = body('title')
  .isLength({min: 3})
  .withMessage('Минимальная длина названия 3 символа')
  .trim()

const coursePriceValidator = body('price')
  .isNumeric()
  .withMessage('Введите корректную цену')

const imgValidator = body('img', 'Введите корректный Url картинки')
  .isURL()

exports.courseValidators = [
    courseTitleValidator,
    coursePriceValidator,
    imgValidator
]