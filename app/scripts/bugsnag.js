/*!
 * bugsnag.js
 * Created by Kilian Ciuffolo on Feb 28, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

const bugsnag = require('bugsnag-js')

bugsnag.apiKey = '681a4a8ffa9d9b06b608ce24b0bda125'
bugsnag.releaseStage = process.env.NODE_ENV
bugsnag.notifyReleaseStages = ['staging', 'production']
bugsnag.appVersion = '__VERSION__'

module.exports = bugsnag
