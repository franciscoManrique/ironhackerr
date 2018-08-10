const multer = require('multer');
const fs = require('fs');

const UPLOAD_PATH = 'public/documents/';

module.exports = multer({
  dest: UPLOAD_PATH
});
