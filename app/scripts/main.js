/*!
 * main.js
 * Created by Kilian Ciuffolo on Feb 15, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const bugsnag = require('./bugsnag') // eslint-disable-line
const setupContactDialogs = require('./dialogs')
const setupForms = require('./forms')
const setupNav = require('./nav')
const setupTracking = require('./tracking')
const setupAnchors = require('./anchors')
const analytics = require('./segmentio')

console.info('Hey you curious fellow!')

// init segmentio
// if (process.env.NODE_ENV === 'production') {
  analytics.init('FEwiQRqpIG8YKwjQgHGQ1S7KJUNfRCH8')
  analytics.page()
// }

setupNav()
setupAnchors()
setupContactDialogs()
setupForms()
setupTracking()
