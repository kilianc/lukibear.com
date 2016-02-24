/*!
 * tracking.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')
var mixpanel = require('mixpanel-browser')

function setupTracking () {
  // init google analytics
  /* global ga */
  ga('create', 'UA-64479821-1', 'auto')
  ga('send', 'pageview')
  exports.ga = ga

  // init mixpanel
  mixpanel.init('19c6e5ecadfd02735d072f11d7bc5cdb')
  mixpanel.track('page-view')

  // track clicks
  $('[data-track-id]').on('click', function () {
    mixpanel.track('click', {
      link: $(this).attr('data-track-id'),
      label: $(this).val()
    })
  })
}

exports.mixpanel = mixpanel
exports.setupTracking = setupTracking
