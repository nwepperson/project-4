'use strict';

angular.module('movieShareApp')
  .service('channelService', function($http) {

    var svc = this;
    svc.channels = [];

    svc.getChannels = function() {
      var promise = $http.get('/api/channels');
      promise.then(function(response) {
        svc.channels = response.data;
      });
      return promise;
    };

    svc.getPublicChannels = function() {
      var promise= $http.get('/api/channels/public');
      promise.then(function(response) {
        svc.PublicChannels = response.data;
      });
      return promise;
    };

    svc.sendMovie = function(newMovie, channel) {
      $http.get('https://www.omdbapi.com/?t=' + newMovie + '&tomatoes=true&plot=full')
      .then(function(response) {
      if (response.data.Response === 'True') {
        console.log('POSTING new movie:', response.data.Title);
      return $http.post('/api/movies',
                        { Title: response.data.Title,
                          Year: response.data.Year,
                          Rated: response.data.Rated,
                          Released: response.data.Released,
                          Runtime: response.data.Runtime,
                          Genre: response.data.Genre,
                          Director: response.data.Director,
                          Writer: response.data.Writer,
                          Actors: response.data.Actors,
                          Plot: response.data.Plot,
                          Language: response.data.Language,
                          Country: response.data.Country,
                          Awards: response.data.Awards,
                          Poster: response.data.Poster,
                          Metascore: response.data.Metascore,
                          imdbRating: response.data.imdbRating,
                          imdbVotes: response.data.imdbVotes,
                          imdbId: response.data.imdbID,
                          Type: response.data.Type,
                          tomatoMeter: response.data.tomatoMeter,
                          tomatoImage: response.data.tomatoImage,
                          tomatoRating: response.data.tomatoRating,
                          tomatoReviews: response.data.tomatoReviews,
                          tomatoFresh: response.data.tomatoFresh,
                          tomatoRotten: response.data.tomatoRotten,
                          tomatoConsensus: response.data.tomatoConsensus,
                          tomatoUserMeter: response.data.tomatoUserMeter,
                          tomatoUserRating: response.data.tomatoUserRating,
                          tomatoUserReviews: response.data.tomatoUserReviews,
                          tomatoUrl: response.data.tomatoURL,
                          DVD: response.data.DVD,
                          BoxOffice: response.data.BoxOffice,
                          Production: response.data.Production,
                          Website: response.data.Website,
                          Response: response.data.Response,
                          channelId: channel._id,
                          active: true
                        });
      }
      });
    };

    svc.deleteMovie = function(movie, channel) {
      console.log('movie: ', movie.Title);
      // console.log('channel: ', channel);
      var index = channel.movies.indexOf(movie);
      console.log('index: ', index);
      var match = channel.movies[index];
      if (match) {
        console.log('DELETING match: ', match.Title);
        return $http.delete('/api/movies/' + channel._id + '/' + match._id);
      }
      else {
        console.log('match not found');
      }
    };

    svc.findById = function(id) {
      console.log('findById called with id:', id);
      console.log('svc.channels:', svc.channels);
      var result = _.find(svc.channels, function(channel) {
        return channel._id === id;
      });
      if (!result) {
        console.log('now serching svc.PublicChannels:', svc.PublicChannels);
        result = _.find(svc.PublicChannels, function(channel) {
          return channel._id === id;
        });
      }
      console.log('findById returning:', result);
      return result;
    };

    svc.newChannel = function(newChannelName, newChannelDescription, newChannelShare) {
      console.log('newChannelName: ', newChannelName);
      console.log('newChannelDescription: ', newChannelDescription);
      console.log('newChannelShare: ', newChannelShare);
      if (newChannelName !== undefined && newChannelName !== '') {
        if (newChannelDescription !== undefined && newChannelDescription !== '') {
          if (newChannelShare !== undefined  && newChannelShare !== '') {
            return $http.post('/api/channels',
                            { name: newChannelName,
                              description: newChannelDescription,
                              share: newChannelShare,
                              movies: []
                            });
          }
        }
      }
    };

    svc.deleteChannel = function(channel) {
      return $http.delete('/api/channels/' + channel._id);
    };

    svc.copyChannel = function(channel) {
      console.log(channel);
      var matchStat = false;
      $http.get('/api/channels').then(function(response) {
        var channels = response.data;
        channels.forEach(function(channelMatch) {
          if (channelMatch._id === channel._id) {
            console.log('CHANNEL ALREADY EXISTS');
            matchStat = true;
          }
        });
      });
      if (matchStat !== true) {
        return $http.post('/api/channels',
                            { name: channel.name,
                              description: channel.description,
                              share: channel.share,
                              movies: channel.movies
                            });
      }
    };

    svc.getMe = function() {
      return $http.get('/api/users/me');
    };
  });
