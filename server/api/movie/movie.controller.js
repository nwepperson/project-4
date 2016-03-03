/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/movies              ->  index
 * POST    /api/movies              ->  create
 * GET     /api/movies/:id          ->  show
 * PUT     /api/movies/:id          ->  update
 * DELETE  /api/movies/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Movie from './movie.model';
import Channel from '../channel/channel.model';
import User from '../user/user.model';
var MovieEvents = require('./movie.events');

function respondWithResult(res, statusCode) {
  console.log('respondWithResult with res.statusCode:', res.statusCode);
  statusCode = statusCode || res.statusCode || 200;
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
  console.log('handleError with res.statusCode:', res.statusCode);
  statusCode = statusCode || res.statusCode || 500;
  return function(err) {
    console.log('handleError sending response with statusCode:', statusCode);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Movies
export function index(req, res) {
  Movie.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Movie from the DB
export function show(req, res) {
  Movie.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Movie in the DB
export function create(req, res) {
  console.log('CREATING A NEW MOVIE');
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  Channel.findById(req.body.channelId)
  .then(function(channel) {
    if (!channel) {
      console.log('Channel not found.');
      return res.status(404).send('Channel not found.');
    }
    console.log('Comparing req.user._id !== channel.owner:', req.user._id, channel.owner);
    if (req.user._id.equals(channel.owner) === false) {
      console.log("Cannot add to another user's list");
      return res.status(401).send('User not authorized to add movie to that channel');
    }
    console.log('users match');
    var exists = _.find(channel.movies, function(movie) {
      return movie.imdbId === req.body.imdbId;
    });
    if (exists) {
      console.log('MOVIE ALREADY EXISTS IN CHANNEL:', exists.Title);
      // return res.status(400).send('Movie Already Exists in Channel.');
      res.status(400).end();
      return null;
    }

    var newMovie = channel.movies.create(req.body);
    channel.movies.push(newMovie);
    console.log('newMovie id created in api/movie.controller', newMovie._id, newMovie.Title);
    MovieEvents.emit('save', { movie: newMovie, channelId: channel._id });
    return channel.save();
  })
  .then(respondWithResult(res, 201))
  .catch(function(res) {
    console.log('calling handleError, res.customStatus =', res.customStatus);
    return handleError(res);
  });
}

// Updates an existing Movie in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Movie.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Movie from the DB
export function destroy(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  Channel.findById(req.params.id)
  .then(function(channel) {
    if (!channel) {
      console.log('Channel not found.');
      return res.status(404).send('Channel not found.');
    }
    console.log('Comparing req.user._id !== channel.owner:', req.user._id, channel.owner);
    if (req.user._id.equals(channel.owner) === false) {
      console.log("Cannot delete from another user's list");
      return res.status(401).send('User not authorized to add movie to that channel');
    }
    console.log('users match');
    var exists = _.find(channel.movies, function(movie) {
      return movie._id.equals(req.params.movieId);
    });
    if (!exists) {
      console.log('MOVIE DOES NOT EXIST IN CHANNEL:');
      res.status(400).end();
      return null;
    }
    var index = channel.movies.indexOf(exists);
    console.log('Index: ', index);
    channel.movies.splice(index, 1);
    MovieEvents.emit('remove', { movie: exists, channelId: channel._id });
    return channel.save();
  })
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}
