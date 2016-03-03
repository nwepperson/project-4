/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/channels              ->  index
 * POST    /api/channels              ->  create
 * GET     /api/channels/:id          ->  show
 * PUT     /api/channels/:id          ->  update
 * DELETE  /api/channels/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Channel from './channel.model';
import User from '../user/user.model';
import MovieEvents from '../movie/movie.events';
// var ChannelEvents = require('./channel.events');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Channels
export function index(req, res) {
  Channel.find({owner: req.user}).populate('owner movies.user')
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of public Channels
export function publicIndex(req, res) {
  Channel.find({share: 'public'}).populate('owner movies.user')
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Channel from the DB
export function show(req, res) {
  Channel.findById(req.params.id).populate('owner movies.user')
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Channel in the DB
export function create(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var channels;
  var match;
  Channel.find({owner: req.user}).then(function(response) {
    channels = response;
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      if (channel.name === req.body.name){
        console.log('match name');
        match = true;
      }
    }
    if (match !== true) {
    var newChannel = Channel.create({
    name: req.body.name,
    description: req.body.description,
    active: true,
    share: req.body.share,
    owner: req.user,
    movies: req.body.movies
    });
    }
  });
}

// Updates an existing Channel in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Channel.findById(req.params.id).populate('owner movies.user')
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Channel from the DB
export function destroy(req, res) {
  Channel.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
