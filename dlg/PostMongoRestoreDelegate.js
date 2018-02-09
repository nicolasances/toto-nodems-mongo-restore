var exec = require('child_process').exec;
var moment = require('moment-timezone');
var fs = require('fs');

var a = 'totoances';
var b = 'totonazzi';

exports.postRestore = function(postRequest) {

  return new Promise(function(success, failure) {

    console.log(postRequest);

    if (postRequest == null || postRequest.env == null || postRequest.env == '') {
      failure();
      return;
    }

    var dumpTS = moment().tz('Europe/Rome').format('YYYYMMDDHHmmss');
    var dumpname = 'totodump-' + dumpTS + '.tgz';
    var env = postRequest.env;
    var gitFolder = '/' + env + '-mongo-dump';

    exec('rm -r ' + gitFolder + '; git clone https://' + a + ':' + b + '@gitlab.com/totoances/' + postRequest.env + '-mongo-dump.git; cd ' + gitFolder, function(err, stdout, stderr) {

      fs.readdir(gitFolder, function(err, files) {

        if (files == null || files.length == 0) {
          success();
          return;
        }

        var highestDate = 0;
        for (var i = 0; i < files.length; i++) {

          if (file.indexOf('totodump-') < 0) continue;

          var date = file.substring(9, 23);
          var dateInt = parseInt(date);

          if (dateInt > highestDate) highestDate = dateInt;

        }

        var dumpToRestore = 'totodump-' + highestDate + '.tgz';

        console.log('About to restore dump: ' + dumpToRestore);

        exec('tar -xf ' + dumpToRestore, function(err, stdout, stderr) {

          exec('mongorestore --host mongo:27017 mongo-dump/', function(err, stdout, stderr) {

            console.log(stdout);

            success({succeeded: true});

          });

        });

      });

    });

  });
}
