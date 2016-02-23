/*!
 * nav.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')

function setupNav () {
  var $menu = $('nav')
  var $window = $(window)

  // switch menu class
  $window.on('scroll', function (e) {
    if ($window.scrollTop() <= 0) {
      if ($menu.atTop) return
      $menu.atTop = true
      $menu.addClass('top')
      $menu.removeClass('fixed')
    } else {
      if ($menu.atTop === false) return
      $menu.atTop = false
      $menu.addClass('fixed')
      $menu.removeClass('top')
    }
  }).trigger('scroll')
}

module.exports = setupNav
