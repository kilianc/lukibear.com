/*!
 * anchors.js
 * Created by Kilian Ciuffolo on Feb 24, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')

function setupAnchors () {
  $('section').each(function () {
    var $this = $(this)
    $('<a id="' + $this.attr('class') + '" class="anchor"></a>').insertBefore($this)
  })
}

module.exports = setupAnchors
