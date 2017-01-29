'use strict';

/**
* @ngdoc service
* @name clientApp.googleAnalytics
* @description
* # googleAnalytics
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('googleAnalytics', function ($window) {

    function init() {
        /* jshint ignore:start */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        /* jshint ignore:end */
        $window.ga('create', 'UA-90995979-1', 'auto');
    }

    function trackPage(path) {
        $window.ga('send', 'pageview', path);
    }

    function trackEvent(eventCategory, eventAction) {
        $window.ga('send', 'event', {
            eventCategory: eventCategory, //'Entry Page'
            eventAction: eventAction //'Save clicked'
            //eventLabel: 'some label'
        });
    }

    return {
        init: init,
        trackPage: trackPage,
        trackEvent: trackEvent
    };
});
