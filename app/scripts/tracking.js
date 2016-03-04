/*!
 * tracking.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const $ = require('jquery')
const analytics = require('./segmentio')

module.exports = function setupTracking () {
  // track clicks
  $('[data-track-id]').on('click', (e) => {
    let $link = $(e.currentTarget)

    analytics.track('click', {
      link: $link.attr('data-track-id'),
      label: ($link.val() || $link.text()).toLowerCase()
    })
  })
}
