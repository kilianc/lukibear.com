/*!
 * anchors.js
 * Created by Kilian Ciuffolo on Feb 24, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const $ = require('jquery')

function setupAnchors () {
  $('section').each((i, section) => {
    let $section = $(section)
    $(`<a id="${$section.attr('class')}" class="anchor"></a>`).insertBefore($section)
  })
}

module.exports = setupAnchors
