'use strict';

angular.module('movieShareApp')
  .controller('ChannelsCtrl', function(channelService) {
    var vm = this;
    vm.newMovie = 'Search for movie here';

    channelService.getChannels().then(function(response) {
      vm.channels = response.data;
      vm.selectedChannel = vm.channels.length > 0 ? vm.channels[0] : null;
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
