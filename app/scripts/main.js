/*!
 * main.js
 * Created by Kilian Ciuffolo on Feb 15, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')
var setupContactDialogs = require('./dialogs')
var setupForms = require('./forms')
var setupNav = require('./nav')
var setupSlaask = require('./slaask')
var setupTracking = require('./tracking').setupTracking
var setupAnchors = require('./anchors')

$(function () {
  console.info('Hey you curious fellow!')
  setupNav()
  setupAnchors()
  setupContactDialogs()
  setupForms()
  setupSlaask()
  setupTracking()
})
