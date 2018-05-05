var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Message = require('../models/Message.js');
var socket = require('socket.io-client')('http://localhost:3003');

/* GET ALL MESSAGES */
router.get('/', function(req, res, next) {
    Message.find(function (err, messages) {
        if (err) return next(err);
        res.json(messages);
    });
});

/* GET SINGLE MESSAGE BY ID */
router.get('/:id', function(req, res, next) {
    Message.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE MESSAGE */
router.post('/', function(req, res, next) {
    Message.create(req.body, function (err, post) {
        if (err) return next(err);
        //burada json parser kullanılıyor.
        socket.emit('rest chat message', {message: req.body.message, username: req.body.username});
        console.log(req.body);
        res.json(post);
    });
});

/* UPDATE MESSAGE */
router.put('/:id', function(req, res, next) {
    Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE MESSAGE */
router.delete('/:id', function(req, res, next) {
    Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
