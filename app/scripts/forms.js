/*!
 * forms.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

var $ = require('jquery')
var isValidEmail = require('email-validator').validate
var phoneFormatter = require('phone')
var tracking = require('./tracking')

function isValidPhone (s) {
  return !!phoneFormatter(s).length
}

function isValidContact (s) {
  return isValidEmail(s) || isValidPhone(s)
}

function validateContactField ($form) {
  var $field = $form.find('input[name="contact"]')
  var value = $field.val()
  var isValid = isValidContact(value)

  if (!isValid && value) {
    $field.addClass('error')
  } else {
    $field.removeClass('error')
  }

  return isValid
}

function validateNameField ($form) {
  var $field = $form.find('input[name="name"]')
  var value = $field.val()
  var isValid = !!value

  if (!isValid && value) {
    $field.addClass('error')
  } else {
    $field.removeClass('error')
  }

  return isValid
}

function validateContactQuickForm () {
  var $form = $('#contact-quick form')
  var $submit = $('input[type="submit"]')

  if (validateContactField($form)) {
    $submit.attr('disabled', null)
  } else {
    $submit.attr('disabled', 'disabled')
  }
}

function validateContactFullForm () {
  var $form = $('#contact-full form')
  var $submit = $form.find('input[type="submit"]')

  if (validateContactField($form) && validateNameField($form)) {
    $submit.attr('disabled', null)
  } else {
    $submit.attr('disabled', 'disabled')
  }
}

function onFormSubmit (e) {
  e.preventDefault()

  var contact = $('input[name="contact"]').val()
  var name = $('input[name="name"]').val()
  var budget = $('input[name="budget"]').val()
  var info = $('textarea[name="info"]').val()
  var phone = phoneFormatter(contact)[0]
  var email = isValidEmail(contact) ? contact : ''

  if (phone) {
    contact = phone[0]
  }

  tracking.mixpanel.identify(contact)
  tracking.mixpanel.track('contact', { type: 'full' })
  tracking.mixpanel.people.set({
    $name: name,
    $phone: phone,
    $email: email,
    info: info,
    budget: budget
  })

  $(this).css('display', 'none')
  $(this).parent().find('.thanks').css('display', 'block')
}

function setupForms () {
  $('dialog#contact-quick form')
    .on('submit', onFormSubmit)
    .on('keyup', validateContactQuickForm)

  $('dialog#contact-full form')
    .on('submit', onFormSubmit)
    .on('keyup', validateContactFullForm)

  validateContactQuickForm()
  validateContactFullForm()
}

module.exports = setupForms
