const Movie = require('../models/movie');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  CreatedCode,
} = require('../errors/errors');

/** создать фильм */
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie
    .create({
      country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner,
    })
    .then((movie) => res.status(CreatedCode).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/** получить фильмы */
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie
    .find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

/** удаление фильма */
module.exports.deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Фильм создан другим пользователем'));
      } else {
        Movie
          .deleteOne(movie)
          .then(() => {
            res.send({ message: 'Фильм удален' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
