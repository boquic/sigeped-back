// src/config/swagger.js
import path from 'path';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadSwaggerDoc() {
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
