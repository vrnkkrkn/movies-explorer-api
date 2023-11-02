const mongoose = require('mongoose');
const validator = require('validator');

/** описание схемы фильма */
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введите URL-адрес',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введите URL-адрес',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введите URL-адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

/** создаём модель и экспортируем её */
module.exports = mongoose.model('movie', movieSchema);
