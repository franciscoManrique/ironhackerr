const express = require('express');
const router = express.Router();
const sessionController = require('../controller/session.controller');
const middleware = require('../middlewares/auth.middleware');

router.get('/create', middleware.notAuth, sessionController.create);
router.post('/create', middleware.notAuth, sessionController.doCreate);
router.post('/delete', middleware.auth, sessionController.doDelete);

module.exports = router;
