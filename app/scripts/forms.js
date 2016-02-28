/*!
 * forms.js
 * Created by Kilian Ciuffolo on Feb 23, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const $ = require('jquery')
const isValidEmail = require('email-validator').validate
const phoneFormatter = require('phone')
const mixpanel = require('./tracking').mixpanel

function isValidPhone (s) {
  return !!phoneFormatter(s).length
}

function isValidContact (s) {
  return isValidEmail(s) || isValidPhone(s)
}

function validateContactField ($form) {
  let $field = $form.find('input[name="contact"]')
  let value = $field.val()
  let isValid = isValidContact(value)

  if (!isValid && value) {
    $field.addClass('error')
  } else {
    $field.removeClass('error')
  }

  return isValid
}

function validateNameField ($form) {
  let $field = $form.find('input[name="name"]')
  let value = $field.val()
  let isValid = !!value

  if (!isValid && value) {
    $field.addClass('error')
  } else {
    $field.removeClass('error')
  }

  return isValid
}

function validateContactQuickForm () {
  let $form = $('#contact-quick form')
  let $submit = $('input[type="submit"]')

  if (validateContactField($form)) {
    $submit.attr('disabled', null)
  } else {
    $submit.attr('disabled', 'disabled')
  }
}

function validateContactFullForm () {
  let $form = $('#contact-full form')
  let $submit = $form.find('input[type="submit"]')

  if (validateContactField($form) && validateNameField($form)) {
    $submit.attr('disabled', null)
  } else {
    $submit.attr('disabled', 'disabled')
  }
}

function onFormSubmit (e) {
  e.preventDefault()

  let $form = $(this)
  let $dialog = $form.closest('dialog')
  let contact = $('input[name="contact"]').val()
  let name = $('input[name="name"]').val()
  let budget = $('input[name="budget"]').val()
  let info = $('textarea[name="info"]').val()
  let phone = phoneFormatter(contact)[0]
  let email = isValidEmail(contact) ? contact : ''

  if (phone) {
    contact = phone[0]
  }

  mixpanel.identify(contact)
  mixpanel.track('contact', { type: $dialog.attr('id').replace('contact-', '') })
  mixpanel.people.set({
    $name: name,
    $phone: phone,
    $email: email,
    info: info,
    budget: budget
  })

  $form.css('display', 'none')
  $dialog.find('.thanks').css('display', 'block')
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
