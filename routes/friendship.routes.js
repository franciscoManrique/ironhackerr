const express = require('express');
const router = express.Router();
const friendshipController = require('../controller/friendship.controller');
const middleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

router.get('/:id/list', middleware.auth, friendshipController.list);
router.post('/:id/accept', middleware.auth, friendshipController.acceptFriendship);
router.post('/:id/reject', middleware.auth, friendshipController.rejectFriendship);
router.post('/:id/create', middleware.auth, friendshipController.doCreate);
router.post('/:id/delete', middleware.auth, friendshipController.doDelete);

module.exports = router;
