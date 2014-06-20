var spawn = require('child_process').spawn
  , config = require('config')
  , async = require('async')
  , pink = require('cli-color').xterm(206)
  , cyan = require('cli-color').cyan
  , orange = require('cli-color').xterm(217)
  , yellow = require('cli-color').xterm(229)
  , isTTY = process.stdin.isTTY

if (!isTTY && !process.env.DEBUG_COLORS) {
  pink = function (a) { return a }
  cyan = function (a) { return a }
  orange = function (a) { return a }
  yellow = function (a) { return a }
}

exports.deploy = function deploy(ref) {
  var endpoint = config.deploy.targets[ref]

  banner()

  if (undefined === endpoint) {
    console.log(cyan(' ▸ Ref %s not matching any deployment target, exiting'), ref)
    console.log()
    return
  }

  console.log(cyan(' ▸ Deploying `%s` to %s'), endpoint.path, endpoint.bucket)
  console.log()

  var commands = [{
    cmd: 'grunt',
    args: [
      'build',
      '--no-colors'
    ]
  }, {
    cmd: 'aws',
    args: [
      's3',
      'sync',
      endpoint.path,
      endpoint.bucket,
      '--delete',
      '--acl',
      'public-read',
      '--region',
      endpoint.region || 'us-east-1'
    ]
  }]

  async.forEachSeries(commands, exec, function () {
    console.log()
    console.log(cyan(' ▸ Deploy done, live at %s'), endpoint.url)
  })
}

function banner() {
  console.log()
  console.log(pink('      _/_/_/    _/    _/  _/_/_/    _/_/_/    _/_/_/_/  _/_/_/_/_/   '))
  console.log(pink('     _/    _/  _/    _/  _/    _/  _/    _/  _/            _/        '))
  console.log(pink('    _/_/_/    _/    _/  _/_/_/    _/_/_/    _/_/_/        _/         '))
  console.log(pink('   _/        _/    _/  _/        _/        _/            _/          '))
  console.log(pink('  _/          _/_/    _/        _/        _/_/_/_/      _/           '))
  console.log()
}

function exec(job, done) {
  console.log(orange(' ✈ %s %s'), job.cmd, job.args.join(' '))
  console.log(yellow('   ┌ starting...'))

  var proc = spawn(job.cmd, job.args)

  proc.stdout.setEncoding('utf8')
  proc.stderr.setEncoding('utf8')

  proc.stdout.on('data', printLines)
  proc.stderr.on('data', printLines)

  proc.on('close', function (code) {
    console.log(yellow('   └ done.'))
    code && process.exit(code)

    done && done()
  })
}

function printLines(data) {
  data.split('\\n').forEach(function (line) {
    console.log(yellow('   ├ %s'), line.replace(/\n|\r/gm, ''))
  })
}