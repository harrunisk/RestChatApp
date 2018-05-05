var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PrivateMessage = require('../models/PrivateMessageMessage.js');

/* GET ALL PRIVATEMESSAGES */
router.get('/', function(req, res, next) {
    PrivateMessage.find(function (err, messages) {
        if (err) return next(err);
        res.json(privatemessages);
    });
});

/* GET SINGLE PRIVATEMESSAGE BY ID */
router.get('/:id', function(req, res, next) {
    PrivateMessage.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE PRIVATEMESSAGE */
router.post('/', function(req, res, next) {
    PrivateMessage.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE PRIVATEMESSAGE */
router.put('/:id', function(req, res, next) {
    PrivateMessage.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE PRIVATEMESSAGE */
router.delete('/:id', function(req, res, next) {
    PrivateMessage.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
