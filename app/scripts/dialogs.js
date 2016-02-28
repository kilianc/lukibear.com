/*!
 * dialogs.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const $ = require('jquery')

function closeAllDialogs () {
  $('body').css('overflow', '')
  $('dialog').css('display', 'none')
  $('dialog .thanks').css('display', 'none')
  $('dialog form').css('display', 'block')
}

function openDialog (name) {
  closeAllDialogs()
  $('body').css('overflow', 'hidden')
  $(`#${name}`).css('display', 'block')
}

function setupContactDialogs () {
  $('a[href="#contact-quick"]').on('click', () => {
    openDialog('contact-quick')
  })

  $('a[href="#contact-full"]').on('click', () => {
    openDialog('contact-full')
  })

  $('dialog .close').on('click', closeAllDialogs)

  $('.btn-close').on('click', closeAllDialogs)

  $('.input-select button').on('click', (e) => {
    e.preventDefault()
    var $button = $(e.currentTarget)
    var $input = $button.siblings('input[type="hidden"]')
    $button.siblings('button').removeClass('selected')
    $button.addClass('selected')
    $input.val($button.text())
  })

  $(document).keyup((e) => {
    if (e.keyCode !== 27) return
    closeAllDialogs()
  })
}

module.exports = setupContactDialogs
