/*!
 * dialogs.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')

function closeAllDialogs () {
  $('body').css('overflow', '')
  $('dialog').css('display', 'none')
  $('dialog .thanks').css('display', 'none')
  $('dialog form').css('display', 'block')
}

function openDialog (name) {
  closeAllDialogs()
  $('body').css('overflow', 'hidden')
  $('#' + name).css('display', 'block')
}

function setupContactDialogs () {
  $('a[href="#contact-quick"]').on('click', function () {
    openDialog('contact-quick')
  })

  $('a[href="#contact-full"]').on('click', function () {
    openDialog('contact-full')
  })

  $('dialog .close').on('click', closeAllDialogs)

  $('.btn-close').on('click', closeAllDialogs)

  $('.input-select button').on('click', function (e) {
    e.preventDefault()
    var $this = $(this)
    var $input = $this.siblings('input[type="hidden"]')
    $this.siblings('button').removeClass('selected')
    $this.addClass('selected')
    $input.val($this.text())
  })

  $(document).keyup(function (e) {
    if (e.keyCode !== 27) return
    closeAllDialogs()
  })
}

module.exports = setupContactDialogs
