const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/сentralizedErrorHandler');
const { signupValidation, signinValidation } = require('./middlewares/validation');

const { PORT = 3005, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { NotFoundError } = require('./errors/errors');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** подключаемся к серверу mongo */
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post('/signup', signupValidation, createUser);

app.post('/signin', signinValidation, login);

/** авторизация */
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

/** обработчики ошибок */
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(centralizedErrorHandler);

/** подключаем мидлвары, роуты и всё остальное */
app.listen(PORT);
