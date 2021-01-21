const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')


const regEmail = require('../utils/emails/registrations')
const resetEmail = require('../utils/emails/reset')
const keys = require('../utils/keys')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'emelinevgeny1990@gmail.com',
        clientId: keys.CLIENT_ID,
        clientSecret: keys.SECRET_KEY,
        refreshToken: keys.REFRESH_TOKEN,
        accessToken: keys.ACCESS_TOKEN
    }
})


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const passwordCompare = await bcrypt.compare(password, candidate.password)
            if (passwordCompare) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login')
            }
        } else {
            req.flash('loginError', 'Пользователь не найден')
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })
        await user.save()
        res.redirect('/auth/login#login')
        //send email
        await transporter.sendMail(regEmail(email))
    } catch (error) {
        console.log(error)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так. Повторите попытку позже.')
                return res.redirect('auth/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})
            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600 * 1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (!user) {
            return res.redirect('/auth/login')
        }
        res.render('auth/password', {
            title: 'Восстановить доступ',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
    } catch (e) {

    }


})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Токен недействителен')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})



module.exports = router