'use strict';

angular.module('movieShareApp')
  .service('channelService', function($http) {

    var svc = this;
    svc.channels = [];

    svc.getChannels = function() {
      var promise= $http.get('/api/channels');
      promise.then(function(response) {
        svc.channels = response.data;
      });
      return promise;
    };

    svc.sendMovie = function(newMovie, channel) {
      var result = $http.get('http://www.omdbapi.com/?t=' + filter + '&tomatoes=true&plot=full');
      return $http.post('/api/movies',
                        { title: response.data.Title,
                          year: response.data.Year,
                          rated: response.data.Rated,
                          released: response.data.Released,
                          runtime: response.data.Runtime,
                          genre: response.data.Genre,
                          director: response.data.Director,
                          writer: response.data.Writer,
                          actors: response.data.Actors,
                          plot: response.data.Plot,
                          language: response.data.Language,
                          country: response.data.Country,
                          awards: response.data.Awards,
                          poster: response.data.Poster,
                          metascore: response.data.Metascore,
                          imdbRating: response.data.imdbRating,
                          imdbVotes: response.data.imdbVotes,
                          imdbId: response.data.imdbID,
                          type: response.data.Type,
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
                          dvd: response.data.DVD,
                          boxOffice: response.data.BoxOffice,
                          production: response.data.Production,
                          website: response.data.Website,
                          response: response.data.Response,
                          user: req.user,
                          channelId: channel._id,
                          active: true
                        });
    };

    svc.findById = function(id) {
      return _.find(svc.channels, function(channel) {
        return channel._id === id;
      });
    };
  });
