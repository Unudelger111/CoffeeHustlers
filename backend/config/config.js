const path = require('path');

// Move one level up from /config to reach the project root
const PROJECT_ROOT = path.join(__dirname, '..');

const config = {
  ROOT_DIR: PROJECT_ROOT,
  PROJECT_DIR: PROJECT_ROOT,
  URL_PORT: process.env.PORT || 3000,
  URL_PATH: 'http://localhost',
  BASE_VERSION: '',
  CONTROLLER_DIRECTORY: path.join(PROJECT_ROOT, 'controllers'),
  OPENAPI_YAML: path.join(PROJECT_ROOT, 'api', 'openapi.yaml'),
  FILE_UPLOAD_PATH: path.join(PROJECT_ROOT, 'uploaded_files'),
};

// Optional: Helpful full URL for logging or Swagger
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`;

module.exports = config;
