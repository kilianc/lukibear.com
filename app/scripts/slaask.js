/*!
 * slaask.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')

function setupSlaask () {
  $(window).one('load', function () {
    /* global _slaask */
    _slaask.init('ea305819f32b4360a3c76e157dba9624')
  })
}

module.exports = setupSlaask
