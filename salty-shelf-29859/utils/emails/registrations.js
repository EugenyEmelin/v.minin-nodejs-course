const keys = require('../keys')

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловатть в наш магазин</h1>
      <p>Вы успешно создали аккаунт</p>
      <p>Ваш логин ${email}</p>
      <hr>
      <a href="${keys.BASE_URL}">Магазин курсов</a>
    `
  }
}