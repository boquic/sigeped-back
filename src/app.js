// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const { loadSwaggerDoc } = require('./config/swagger');
const { errorHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const { config } = require('./config/env');

const app = express();

if (config.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({ origin: config.corsOrigins, credentials: true, allowedHeaders: ['Authorization', 'Content-Type'] }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Auth API ready' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

const swaggerDoc = loadSwaggerDoc();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);

module.exports = app;