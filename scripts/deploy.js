var spawn = require('child_process').spawn
  , config = require('config')
  , pink = require('cli-color').xterm(206)
  , cyan = require('cli-color').cyan
  , orange = require('cli-color').xterm(217)
  , yellow = require('cli-color').xterm(229)

exports.deploy = function deploy(ref) {
  var endpoint = config.deploy.targets[ref]

  if (undefined === endpoint) {
    console.log(cyan(' ▸ Ref %s not mathing any deployment target, exiting'), ref)
    return
  }

  banner()
  console.log(cyan(' ▸ Deploying `%s` to %s', endpoint.path), endpoint.bucket)
  console.log()

  var args = [
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

  console.log(orange(' ✈ aws %s'), args.join(' '))
  console.log(yellow('   ┌ upload: starting...'))

  var proc = spawn('aws', args)

  proc.stdout.setEncoding('utf8')
  proc.stderr.setEncoding('utf8')

  proc.stdout.on('data', printLines)
  proc.stderr.on('data', printLines)

  proc.on('close', function (code) {
    console.log(yellow('   └ upload: done.'))
    console.log()
    console.log(cyan(' ▸ Deploy done, live at %s'), endpoint.url)
    console.log()
    process.exit(code)
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

function printLines(data) {
  data.split('\\n').forEach(function (line) {
    console.log(yellow('   ├ %s -'), line.replace(/\n|\r/gm, ''))
  })
}