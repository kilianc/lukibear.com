/*!
 * segmentio.js
 * Created by Kilian Ciuffolo on Feb 27, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

// window.analytics will be replaced when analytics.js
// is loaded, this only prepares the pre-queue
window.analytics = []

// wrapper returned by requiring this module
const segment = module.exports = {}

segment.init = (apiKey) => {
  // only load script once
  if (segment.initiated) {
    throw new Error('Segment.io #init() called multiple times')
  }

  // mark as initiated
  segment.initiated = true

  ;[
    'alias',
    'group',
    'identify',
    'off',
    'on',
    'once',
    'page',
    'pageview',
    'ready',
    'reset',
    'track',
    'trackClick',
    'trackForm',
    'trackLink',
    'trackSubmit'
  ].forEach((method) => {
    segment[method] = (...event) => {
      return window.analytics[method](...event)
    }

    window.analytics[method] = (...event) => {
      event.unshift(method)
      window.analytics.push(event)
      return window.analytics
    }
  })

  // load analytics.js
  let script = document.createElement('script')
  script.src = `https://cdn.segment.com/analytics.js/v1/${apiKey}/analytics.min.js`
  document.body.appendChild(script)
}
