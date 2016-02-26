'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MovieSchema = new mongoose.Schema({
  title: String,
  year: String,
  rated: String,
  released: String,
  runtime: String,
  genre: String,
  director: String,
  writer: String,
  actors: String,
  plot: String,
  language: String,
  country: String,
  awards: String,
  poster: String,
  metascore: String,
  imdbRating: String,
  imdbVotes: String,
  imdbId: String,
  type: String,
  tomatoeMeter: String,
  tomatoeImage: String,
  tomatoRating: String,
  tomatoeReviews: String,
  tomatoeFresh: String,
  tomatoeRotten: String,
  tomatoeConsensus: String,
  tomatoeUserMeter: String,
  tomatoeUserRating: String,
  tomatoeUserReviews: String,
  tomatoeUrl: String,
  dvd: String,
  boxOffice: String,
  production: String,
  website: String,
  response: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  channelId: mongoose.Schema.ObjectId,
  active: Boolean
});

export default mongoose.model('Movie', MovieSchema);
