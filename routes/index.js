const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/errors');
const { signupValidation, signinValidation } = require('../middlewares/validation');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

/** авторизация */
router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
