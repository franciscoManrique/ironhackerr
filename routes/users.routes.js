const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const middleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

const upload = require('../services/uploader.service');//MULTER



router.get('/:id/gallery', middleware.auth, userController.showGallery);

router.get('/:id/friends/list', middleware.auth, middleware.blockFriendList, userController.friendList);

router.get('/confirm', middleware.notAuth, userController.confirm);
router.post('/:id/delete', middleware.auth, middleware.checkRole(constants.user.ADMIN), userController.doDelete);

router.get('/create', middleware.notAuth, userController.create);
router.post('/create', middleware.notAuth, userController.doCreate);

router.get('/list', middleware.auth, userController.list);

router.get('/:id/edit', middleware.auth, middleware.isOwneredByOwnSession, userController.update);
router.post('/:id/edit', middleware.auth, middleware.isOwneredByOwnSession, upload.single('image'), userController.doUpdate);

router.get('/:id', middleware.auth, userController.profile);
// middleware.checkFriendship(constants.status.FRIENDS)

router.get('/', middleware.auth, userController.profile);

module.exports = router;

