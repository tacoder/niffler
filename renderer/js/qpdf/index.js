var spawn  = require('child_process').spawn;
var stream = require('stream');

var Qpdf = {};

Qpdf.decrypt = function(input, password, output, callback) {
  if (!input) return handleError(new Error('Specify input file'), callback);
  if (!password) return handleError(new Error('Password missing'), callback);

  var args = [Qpdf.command, '--decrypt'];

  // Password
  args.push('--password=' + password);

  // Input file path
  args.push( input );

  // Print PDf on output file.
  args.push(output);

  // Execute command and return stdout for pipe
  var outputStream = executeCommand(args, callback);
  if (outputStream) {
    return outputStream;
  }
};

function executeCommand(args, callback) {
  var child;

  var output = args[args.length - 1];

  // if on windows or not piping to stdout
  if (process.platform === 'win32' || output !== '-') {
    child = spawn(args[0], args.slice(1));
  } else {
    // this nasty business prevents piping problems on linux
    // Also causes spaces inside args to fuck the entire command.
    child = spawn('/bin/sh', ['-c', args.join(' ') + ' | cat']);
  }

  // call the callback with null error when the process exits successfully
  if (callback) {
    child.on('exit', function() { callback(null, output); });
  }

  var outputStream = child.stdout;

  child.once('error', function (err) {
    handleError(err, child, outputStream, callback);
  });
  child.stderr.once('data', function(err) {
    handleError(new Error(err || ''), child, outputStream, callback);
  });

  // return stdout stream so we can pipe
  return outputStream;
}

function handleError(err, child, outputStream, callback) {
  if (child) {
    child.removeAllListeners('exit');
    child.kill();
  } else if (typeof child === 'function') {
    callback = child;
  }

  // call the callback if there is one
  if (callback) {
    callback(err);
  }

  // set a default output stream if not present
  if (typeof outputStream === 'function') {
    callback = outputStream;
    outputStream = new stream.Readable();
  } else if (typeof outputStream === 'undefined') {
    outputStream = new stream.Readable();
  }

  // if not, or there are listeners for errors, emit the error event
  if (!callback || outputStream.listeners('error').length > 0) {
    outputStream.emit('error', err);
  }
}


Qpdf.command = 'qpdf';
module.exports = Qpdf;
