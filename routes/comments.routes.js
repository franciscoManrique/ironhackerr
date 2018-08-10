const express = require('express');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controller/comment.controller');
const middleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

router.post('/create', middleware.auth, commentsController.doCreate);
//PROTEJO EL DELETE DEL COMMENT EN EL RPOMIO CONTROLLER YA QUE EN EL MIDDLEWARE NO TENGO ACCESO A COMMENTS
router.post('/:commentId/delete', middleware.auth, commentsController.doDelete);

module.exports = router;
