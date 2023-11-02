const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  CreatedCode,
} = require('../errors/errors');

/** создать пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User
        .create({
          name, email, password: hash,
        })
        .then((user) => res.status(CreatedCode).send({
          name: user.name, _id: user._id, email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные '));
          } else {
            next(err);
          }
        });
    });
};

/** обновить профиль */
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      /** создадим токен */
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

      /** вернём токен */
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

/** возвращает информацию о текущем пользователе */
module.exports.getCurrentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch(next);
};
