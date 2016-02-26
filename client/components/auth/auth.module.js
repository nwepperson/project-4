'use strict';

angular.module('movieShareApp.auth', [
  'movieShareApp.constants',
  'movieShareApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
