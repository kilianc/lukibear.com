/*!
 * tracking.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')
var mixpanel = require('mixpanel-browser')

function setupTracking () {
  // init mixpanel
  if (process.env.NODE_ENV === 'production') {
    mixpanel.init('19c6e5ecadfd02735d072f11d7bc5cdb')
    mixpanel.track('page-view')
  } else {
    mixpanel.track = function () {}
    mixpanel.identify = function () {}
    mixpanel.people = { set: function () {} }
  }

  // track clicks
  $('[data-track-id]').on('click', function () {
    mixpanel.track('click', {
      link: $(this).attr('data-track-id'),
      label: $(this).val()
    })
  })

  // inspectlet
  window.__insp = window.__insp || []
  if (process.env.NODE_ENV === 'production') {
    window.__insp.push(['wid', 2147080968])
  }

  // init google analytics
  if (process.env.NODE_ENV === 'production') {
    var ga = window.ga = function () {
      ga.q = [arguments]
    }
    ga.l = 1 * new Date()
    ga('create', 'UA-64479821-1', 'auto')
    ga('send', 'pageview')
  } else {
    window.ga = function () {}
  }
}

exports.mixpanel = mixpanel
exports.setupTracking = setupTracking
exports.ga = window.ga
