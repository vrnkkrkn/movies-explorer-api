const router = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

/** возвращает все сохранённые текущим пользователем фильмы */
router.get('/', getMovies);

/** создаёт фильм */
router.post('/', createMovieValidation, createMovie);

/** удаляет фильм */
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
