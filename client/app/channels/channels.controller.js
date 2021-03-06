'use strict';

angular.module('movieShareApp')
  .controller('ChannelsCtrl', function(channelService, $scope, socketFactory) {
    var vm = this;
    vm.party = false;
    vm.newMovie = 'Search for movie here';
    vm.movieHideId = '';
    channelService.getMe().then(function(response) {
      vm.me = response.data;

      // socket.io now auto-configures its connection when we ommit a connection url
      var ioSocket = io('', {
        // Send auth token on connection, you will need to DI the Auth service above
        // 'query': 'token=' + Auth.getToken()
        path: '/socket.io-client'
      });

      var socket = socketFactory({ ioSocket });

      channelService.getChannels().then(function(response) {
        vm.channels = response.data;
        channelService.getPublicChannels().then(function(response) {
          vm.publicChannels = response.data;
          if (vm.channels.length > 0) {
            vm.selectedChannel = vm.channels[0];
          }
          else {
            vm.selectedChannel = vm.publicChannels[0];
          }
        });

        // socket.syncUpdates('movie', vm.selectedChannel.movies);
        // TODO: I need to handle movies that arrive on other channels.
        socket.on('movie:save', function(eventData) {
          console.log('event data: ', eventData);
          console.log('eventData.movie._id: ', eventData.movie._id);
          console.log('eventData.channelId: ', eventData.channelId);
          var movie = eventData.movie;
          var channelId = eventData.channelId;
          var affectedChannel = channelService.findById(channelId);
          console.log('affected Channel: ', affectedChannel);
          var match;
          affectedChannel.movies.forEach(function(movieSearch) {
            if (movie.imdbId === movieSearch.imdbId) {
              match = movieSearch;
            }
          });
          console.log('match: ', match);
          // otherwise just add movie to the collection
          if (match === undefined) {
            affectedChannel.movies.push(movie);
            channelService.getChannels().then(function(response) {
              vm.channels = response.data;
              vm.selectedChannel = affectedChannel;
              vm.newMovie = '';
              channelService.getPublicChannels().then(function(response) {
                vm.publicChannels = response.data;
              });
            });
          }
        });

        socket.on('movie:remove', function(eventData) {
          var movie = eventData.movie;
          var channelId = eventData.channelId;
          var oldMovie;
          var affectedChannel = channelService.findById(channelId);
          console.log('affected Channel: ', affectedChannel);
          affectedChannel.movies.forEach(function(movieSearch) {
            if (movieSearch._id === movie._id) {
              oldMovie = movieSearch;
            }
          });
          console.log('Old Movie: ', oldMovie);
          var index = affectedChannel.movies.indexOf(oldMovie);
          console.log('Index: ', index);
          if (oldMovie) {
            affectedChannel.movies.splice(index, 1);
            channelService.getChannels().then(function(response) {
              vm.channels = response.data;
              vm.selectedChannel = affectedChannel;
              channelService.getPublicChannels().then(function(response) {
                vm.publicChannels = response.data;
              });
            });
          }
        });

        socket.on('channel:save', function(eventData) {
          var channel = eventData;
          var match;
          vm.channels.forEach(function(channelSearch) {
            if (channelSearch.name === channel.name) {
              match = true;
            }
          });
          if (match !== true) {
            vm.channels.push(channel);
            channelService.getChannels().then(function(response) {
              vm.channels = response.data;
              channelService.getPublicChannels().then(function(response) {
                vm.publicChannels = response.data;
              });
            });
          }
        });

        socket.on('channel:remove', function(eventData) {
          var channel = eventData;
          var index = vm.channels.indexOf(channel);
          vm.channels.splice(index, 1);
          channelService.getChannels().then(function(response) {
            vm.channels = response.data;
            vm.selectedChannel = vm.channels.length > 0 ? vm.channels[0] : null;
            channelService.getPublicChannels().then(function(response) {
              vm.publicChannels = response.data;
            });
          });
        });

      });
    });

    vm.setSelected = function(channel) {
      vm.selectedChannel = channel;
      console.log('CHANNEL MOVIES: ', channel.movies);
    };

    vm.isSelected = function(channel) {
      return vm.selectedChannel && channel._id === vm.selectedChannel._id;
    };

    vm.sendMovie = function() {
      return channelService.sendMovie(vm.newMovie, vm.selectedChannel);
    };

    vm.deleteMovie = function(movie) {
      channelService.deleteMovie(movie, vm.selectedChannel);
    };

    vm.newChannel = function() {
      channelService.newChannel(vm.newChannelName, vm.newChannelDescription, vm.newChannelShare);
      vm.newChannelName = '';
      vm.newChannelDescription = '';
      vm.newChannelShare = '';
    };

    vm.deleteChannel = function(channel) {
      channelService.deleteChannel(channel);
    };

    vm.copyChannel = function(channel) {
      channelService.copyChannel(channel);
    };

    vm.getMe = function() {
      channelService.getMe().then(function(response) {
        vm.me = response.data;
      });
    };

    vm.hideInfo = function(movie) {
      if(vm.movieHideId === movie._id) {
        vm.movieHideId = '';
      }
      else {
        vm.movieHideId = movie._id;
      }
    };

    vm.partymode = function() {
      if (vm.party === false) {
        vm.party = true;
      }
      else {
        vm.party = false;
      }
      console.log(vm.party);
    }
  });

