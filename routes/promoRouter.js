const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

var authenticate = require('../authenticate');

promoRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (allPromotions) => {
          if (allPromotions.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(allPromotions);
          } else {
            err = new Error('Promotions not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions/');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
      .then(
        (allPromotions) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(allPromotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promoRouter
  .route('/:promoId')
  .get(async (req, res, next) => {
    try {
      const promo = await Promotions.findById(req.params.promoId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Promotion ' + req.params.promoId + ' not found');
    }
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation for promotions/${req.params.promoId} not suported`);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, req.body)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      })
      .catch((err) => {
        res.statusCode = 404;
        res.end(`PUT operation for promotions/${req.params.promoId} failed`);
      });
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId).then(
      (promotion) => {
        res.sendStatus = 200;
        res.setHeader('content-type', 'application/json');
        res.json(promotion);
      },
      (err) => {
        res.statusCode = 403;
        res.end(`Promotion ${req.params.promoId} not removed`);
      }
    );
  });

module.exports = promoRouter;
