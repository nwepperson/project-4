'use strict';

angular.module('movieShareApp')
  .controller('ChannelsCtrl', function(channelService) {
    var vm = this;
    vm.newMovie = 'Search for movie here';

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({ ioSocket });

    channelService.getChannels().then(function(response) {
      vm.channels = response.data;
      vm.selectedChannel = vm.channels.length > 0 ? vm.channels[0] : null;

      // socket.syncUpdates('movie', vm.selectedChannel.movies);
      // TODO: I need to handle movies that arrive on other channels.
      socket.on('movie:save', function(eventData) {
        var movie = eventData.movie;
        var channelId = eventData.channelId;
        var affectedChannel = channelService.findById(channelId);
        var oldMovie = _.find(affectedChannel.movies, {_id: movie._id});
        var index = affectedChannel.movies.indexOf(oldMovie);

        // replace oldMovie if it exists
        // otherwise just add movie to the collection
        if (oldMovie) {
          affectedChannel.movies.splice(index, 1, movie);
        } else {
          affectedChannel.movies.push(movie);
        }
      });

    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('movie');
    });

    vm.setSelected = function(channel) {
      vm.selectedChannel = channel;
    };

    vm.isSelected = function(channel) {
      return channel._id === vm.selectedChannel._id;
    };

    vm.sendMovie = function() {
      channelService.sendMovie(vm.newMovie, vm.selectedChannel)
      .then(function(response) {
        vm.newMovie = 'Search for movie here';
      });
    };
  });
