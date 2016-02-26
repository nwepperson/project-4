'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Movie = require('../movie/movie.model');

var ChannelSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean,
  share: String,
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  movies: [Movie.schema]
});

export default mongoose.model('Channel', ChannelSchema);
