// src/config/swagger.js
const path = require('path');
const YAML = require('yamljs');

function loadSwaggerDoc() {
  const file = path.join(__dirname, '../../docs/openapi.yaml');
  try {
    return YAML.load(file);
  } catch (e) {
    return {
      openapi: '3.0.3',
      info: { title: 'Auth API', version: '1.0.0' },
      paths: {},
    };
  }
}

module.exports = { loadSwaggerDoc };
