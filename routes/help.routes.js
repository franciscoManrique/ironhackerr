const express = require('express');
const router = express.Router();
const helpController = require('../controller/help.controller');
const middleware = require('../middlewares/auth.middleware');

router.get('/create', middleware.auth, helpController.create);
router.post('/create', middleware.auth, helpController.doCreate);

module.exports = router;
