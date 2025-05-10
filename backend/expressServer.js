const http = require('http');
const fs = require('fs');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const jsYaml = require('js-yaml');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const OpenApiValidator = require('express-openapi-validator');
const logger = require('./config/logger');
const config = require('./config/config');
const authenticate = require('./middleware/authMiddleware');

class ExpressServer {
  constructor(port, openApiYaml) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;

    try {
      this.schema = jsYaml.load(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error('failed to load OpenAPI YAML:', e);
      console.error('OpenAPI YAML Error:', e); // Debug full error
    }

    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '14MB' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    // Health check
    this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`));

    // Serve raw OpenAPI spec
    this.app.get('/openapi', (req, res) => res.sendFile(path.resolve(this.openApiPath)));

    // Swagger UI
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));

    // OAuth redirect stubs
    this.app.get('/login-redirect', (req, res) => res.status(200).json(req.query));
    this.app.get('/oauth2-redirect.html', (req, res) => res.status(200).json(req.query));

    // Debug middleware to log request and schema
    this.app.use((req, res, next) => {
      console.log(`Request: ${req.method} ${req.path}`);
      console.log('OpenAPI Schema:', JSON.stringify(req.openapi?.schema, null, 2));
      next();
    });

    // Apply JWT authentication for endpoints with bearerAuth
    this.app.use((req, res, next) => {
      const operation = req.openapi?.schema;
      const requiresAuth = operation?.security?.some((sec) => sec.bearerAuth);
      console.log(`Auth Check for ${req.method} ${req.path}:`, {
        requiresAuth,
        security: operation?.security,
      });
      if (requiresAuth) {
        return authenticate(req, res, next);
      }
      next();
    });

    // OpenAPI Validator
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openApiPath,
        operationHandlers: path.join(__dirname, 'controllers'),
        fileUploader: { dest: config.FILE_UPLOAD_PATH },
        validateRequests: true,
        validateResponses: false,
      }),
    );
  }

  launch() {
    this.app.use((err, req, res, next) => {
      logger.error(err);
      res.status(err.status || 500).json({
        message: err.message || err,
        errors: err.errors || '',
      });
    });

    this.server = http.createServer(this.app).listen(this.port);
    console.log(`🚀 Listening on http://localhost:${this.port}`);
    console.log(`📚 Swagger UI available at http://localhost:${this.port}/api-docs`);
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`🛑 Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;