'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MovieSchema = new mongoose.Schema({
  Title: String,
  Year: String,
  Rated: String,
  Released: String,
  Runtime: String,
  Genre: String,
  Director: String,
  Writer: String,
  Actors: String,
  Plot: String,
  Language: String,
  Country: String,
  Awards: String,
  Poster: String,
  Metascore: String,
  imdbRating: String,
  imdbVotes: String,
  imdbId: String,
  Type: String,
  tomatoMeter: String,
  tomatoImage: String,
  tomatoRating: String,
  tomatoReviews: String,
  tomatoFresh: String,
  tomatoRotten: String,
  tomatoConsensus: String,
  tomatoUserMeter: String,
  tomatoUserRating: String,
  tomatoUserReviews: String,
  tomatoUrl: String,
  DVD: String,
  BoxOffice: String,
  Production: String,
  Website: String,
  Response: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  channelId: mongoose.Schema.ObjectId,
  active: Boolean
});

export default mongoose.model('Movie', MovieSchema);
