'use strict';

angular.module('movieShareApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('channels', {
        url: '/channels',
        templateUrl: 'app/channels/channels.html',
        controller: 'ChannelsCtrl',
        controllerAs: 'vm'
      })
      .state('channel', {
        url: '/channel/:id',
        templateUrl: 'app/channels/channel.html',
        controller: 'ChannelCtrl',
        controllerAs: 'vm'
      });
  });
