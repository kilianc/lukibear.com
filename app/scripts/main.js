/*!
 * main.js
 * Created by Kilian Ciuffolo on Feb 15, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

// this needs to be set ASAP before any other code
// to allow proper error reporting
Bugsnag.releaseStage = process.env.NODE_ENV
Bugsnag.notifyReleaseStages = ['staging', 'production']

const setupContactDialogs = require('./dialogs')
const setupForms = require('./forms')
const setupNav = require('./nav')
const setupTracking = require('./tracking').setupTracking
const setupAnchors = require('./anchors')

console.info('Hey you curious fellow!')

setupNav()
setupAnchors()
setupContactDialogs()
setupForms()
setupTracking()
