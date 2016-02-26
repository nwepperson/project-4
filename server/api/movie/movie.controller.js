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
  Channel.findByIdAsync(req.body.channelId)
  .then(function(channel) {
    if (!channel) {
      return res.status(404).send('Channel not found.');
    }
    var newMovie = channel.movies.create({
      title: req.body.Title,
      year: req.body.Year,
      rated: req.body.Rated,
      released: req.body.Released,
      runtime: req.body.Runtime,
      genre: req.body.Genre,
      director: req.body.Director,
      writer: req.body.Writer,
      actors: req.body.Actors,
      plot: req.body.Plot,
      language: req.body.Language,
      country: req.body.Country,
      awards: req.body.Awards,
      poster: req.body.Poster,
      metascore: req.body.Metascore,
      imdbRating: req.body.imdbRating,
      imdbVotes: req.body.imdbVotes,
      imdbId: req.body.imdbID,
      type: req.body.Type,
      tomatoMeter: req.body.tomatoMeter,
      tomatoImage: req.body.tomatoImage,
      tomatoRating: req.body.tomatoRating,
      tomatoReviews: req.body.tomatoReviews,
      tomatoFresh: req.body.tomatoFresh,
      tomatoRotten: req.body.tomatoRotten,
      tomatoConsensus: req.body.tomatoConsensus,
      tomatoUserMeter: req.body.tomatoUserMeter,
      tomatoUserRating: req.body.tomatoUserRating,
      tomatoUserReviews: req.body.tomatoUserReviews,
      tomatoUrl: req.body.tomatoURL,
      dvd: req.body.DVD,
      boxOffice: req.body.BoxOffice,
      production: req.body.Production,
      website: req.body.Website,
      response: req.body.Response,
      user: req.user,
      active: true
    });
    channel.movies.push(newMovie);
    return channel.save();
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
  Movie.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
