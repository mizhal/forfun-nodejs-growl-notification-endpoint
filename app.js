'use strict';

var config = {
  port: 16661,
  ip: "127.0.0.1"
};

var Promise = require('bluebird');

var Growl = require('node-notifier/notifiers/growl');
var express = require('express');
var bodyParser = require('body-parser');

var growl = Promise.promisifyAll(new Growl());

/** Server/Controller definition */
var NotificationsController = {};
  NotificationsController.push = function(req, res){
    growl.notifyAsync(req.body)
      .then(function(response){
        return res.status(200).json(response);
      })
      .catch(function(error){
        return res.status(500).send(error);
      });
  };

/** Server container with Express */
var app = express();
  // middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
/** Routing **/
var router = express.Router();
  router.post("/", NotificationsController.push);

  app.use(router);
/** HTTP Server front **/
var server = require('http').createServer(app);
  server.listen(config.port, config.ip, function () {
    console.log('Notifications Server listening on %d', config.port);
  });
