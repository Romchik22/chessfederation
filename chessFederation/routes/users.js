var express = require('express');
var router = express.Router();
var usersController = require('../controllers/UserController');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userlist', usersController.getUsers);

router.delete('/userlist/:user', usersController.removeUser);

router.patch('/userlist/:user', usersController.changeRole);

router.get('/:user', usersController.getUser);

router.get('/userlist/useredit/:user', usersController.getUser);

router.patch('/userlist/useredit/:user', usersController.saveChange);

module.exports = router;
