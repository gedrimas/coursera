const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

var authenticate = require('../authenticate');

leaderRouter
  .route('/')
  .get((req, res, next) => {
    Leaders.find({}).then(
      (leaders) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(leaders);
      },
      (err) => {
        err.message = 'Error getting leaders';
        next(error);
      }
    );
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body).then(
      (leader) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(leader);
      },
      (err) => {
        err.message = 'Leader not added';
        next(err);
      }
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({}).then(
      () => {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/plain');
        res.end('Leaders was renoved');
      },
      (err) => {
        err.message = 'Error while leaders deleting';
        next(err);
      }
    );
  });

leaderRouter
  .route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId).then(
      (leader) => {
        if (leader != null) {
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.json(leader);
        } else {
          const err = new Error(
            `Leader with id ${req.params.leaderId} not found`
          );
          err.status = 404;
          next(err);
        }
      },
      (err) => next(err)
    );
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, req.body).then(
      (leader) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(req.body);
      },
      (err) => next(err)
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId).then(
      (leader) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(leader);
      },
      (err) => next(err)
    );
  });

module.exports = leaderRouter;
