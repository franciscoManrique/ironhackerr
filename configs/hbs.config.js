// // view engine setup
const path = require('path');
const hbs = require('hbs');

require('../helpers/misc.helpers')(hbs);

hbs.registerPartials(path.join(__dirname, '../views/partials'));
