const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/сentralizedErrorHandler');

const { PORT = 3005, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

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

app.use(helmet());

app.use(rateLimiter);

app.use(router);

app.use(errorLogger);

/** обработчики ошибок */
app.use(errors());
app.use(centralizedErrorHandler);

/** подключаем мидлвары, роуты и всё остальное */
app.listen(PORT);
