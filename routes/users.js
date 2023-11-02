const router = require('express').Router();
const { updateProfileValidation } = require('../middlewares/validation');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

/** возвращает информацию о пользователе (email и имя) */
router.get('/me', getCurrentUser);

/** обновляет информацию о пользователе (email и имя) */
router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;
