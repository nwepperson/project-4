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
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  Channel.findById(req.body.channelId)
  .then(function(channel) {
    if (!channel) {
      return res.status(404).send('Channel not found.');
    }
    User.find(req.user).then(function(res) {
      var user = String(res[0]._id);
      console.log('user res[0]: ', res[0]._id)
      User.find(channel.owner).then(function(response) {
        var userMatch = String(response[0]._id);
        console.log('userMatch response[0]: ', response[0]._id);
        if (user === userMatch) {
          var exists;
          channel.movies.forEach(function(movie) {
            if (movie.imdbId === req.body.imdbId) {
              console.log('MOVIE ALREADY EXISTS IN CHANNEL');
              exists = true;
            }
          });
          if (exists !== true) {
            var newMovie = channel.movies.create(req.body);
            channel.movies.push(newMovie);
            console.log('newMovie id created in api/movie.controller', newMovie._id);
            channel.save();
            return MovieEvents.emit('save', { movie: newMovie, channelId: channel._id });
          }
        }
        else {
          console.log('user: ', typeof user, user);
          console.log('userMatch: ', typeof userMatch, userMatch);
          console.log("Cannot add to another user's list");
        }
      });
    });
  })
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
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
  Channel.findById(req.params.id)
  .then(function(channel) {
    console.log(channel.movies);
    if (!channel) {
      return res.status(404).send('Channel not found.');
    }
    User.find(req.user).then(function(res) {
      var user = String(res[0]._id);
      console.log('user res[0]: ', res[0]._id)
      User.find(channel.owner).then(function(response) {
        var userMatch = String(response[0]._id);
        console.log('userMatch response[0]: ', response[0]._id);
        if (user === userMatch) {
          channel.movies.forEach(function(movie) {
            if (movie._id.equals(req.params.movieId)) {
              console.log('Movie Match in DB', movie);
              var index = channel.movies.indexOf(movie);
              console.log('Index: ', index);
              channel.movies.splice(index, 1);
              channel.save();
              return MovieEvents.emit('remove', { movie: movie, channelId: channel._id });
            }
          });
        }
        else {
          console.log('user: ', typeof user, user);
          console.log('userMatch: ', typeof userMatch, userMatch);
          console.log("Cannot delete from another user's list");
        }
      });
    });
  })
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}
