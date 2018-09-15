var exec = require('child_process').exec;
var moment = require('moment-timezone');
var fs = require('fs');

var a = 'totoances';
var b = 'totonazzi';

exports.postRestore = function(postRequest) {

  return new Promise(function(success, failure) {

    var dumpTS = moment().tz('Europe/Rome').format('YYYYMMDDHHmmss');
    var dumpname = 'totodump-' + dumpTS + '.tgz';
    var env = 'prod';
    var gitFolder = '/' + env + '-mongo-dump';

    exec('rm -r ' + gitFolder + '; git clone https://' + a + ':' + b + '@gitlab.com/totoances/prod-mongo-dump.git;', function(err, stdout, stderr) {

      fs.readdir(gitFolder, function(err, files) {

        if (files == null || files.length == 0) {
          success();
          return;
        }

        var highestDate = 0;
        for (var i = 0; i < files.length; i++) {

          if (files[i].indexOf('totodump-') < 0) continue;

          var date = files[i].substring(9, 23);
          var dateInt = parseInt(date);

          if (dateInt > highestDate) highestDate = dateInt;

        }

        var dumpToRestore = gitFolder + '/totodump-' + highestDate + '.tgz';

        console.log('About to restore dump: ' + dumpToRestore);

        exec('tar -xf ' + dumpToRestore, function(err, stdout, stderr) {

          console.log(stdout);
          console.log(stderr);
          console.log(err);

          exec('mongorestore --host mongo:27017 /mongo-dump/', function(err, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);
            console.log(err);

            success({succeeded: true});

          });

        });

      });

    });

  });
}
